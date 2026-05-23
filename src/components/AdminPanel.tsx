"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Trash2, X, Settings, Lock, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const compressImage = (file: File, maxWidth: number, maxHeight: number, quality = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        const isPng = file.type === "image/png" || file.type.endsWith("png");
        const mimeType = isPng ? "image/png" : "image/jpeg";
        const fileExt = isPng ? ".png" : ".jpg";

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + fileExt, {
                type: mimeType,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          mimeType,
          isPng ? undefined : quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export function AdminPanel({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("visibility");
  
  // Testimonials tab local state
  const [newStory, setNewStory] = useState({ name: "", role: "", quote: "", image: "" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingDirector, setUploadingDirector] = useState(false);
  
  // Activity Stack local state
  const [newAct, setNewAct] = useState({ title: "", date: "", descEn: "", descTa: "", images: [] as string[] });
  const [uploadingActPhotos, setUploadingActPhotos] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    if (isOpen && !data) {
      fetch("/api/cms")
        .then(res => res.json())
        .then(d => {
          setData(d);
          setLoading(false);
        });
    }
  }, [isOpen, data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Changes saved! Refreshing page to apply...");
      window.location.reload();
    } catch (e) {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setData({
          ...data,
          gallery: [
            ...data.gallery,
            { id: Date.now().toString(), src: result.url, category: "New", alt: "Uploaded image", descEn: "", descTa: "" }
          ]
        });
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleTestimonialImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const rawFile = e.target.files[0];

    setUploadingImage(true);
    try {
      const file = await compressImage(rawFile, 1000, 1000, 0.7);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setNewStory(prev => ({ ...prev, image: result.url }));
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };


  const handleActPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    setUploadingActPhotos(true);
    try {
      const uploadedUrls: string[] = [];
      for (const rawFile of files) {
        const file = await compressImage(rawFile, 1200, 1200, 0.75);
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (result.success) {
          uploadedUrls.push(result.url);
        }
      }
      
      setNewAct(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (err) {
      alert("Some photos failed to upload.");
    } finally {
      setUploadingActPhotos(false);
    }
  };

  const handleAppendPhotosToActivity = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    setSaving(true);
    try {
      const uploadedUrls: string[] = [];
      for (const rawFile of files) {
        const file = await compressImage(rawFile, 1200, 1200, 0.75);
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (result.success) {
          uploadedUrls.push(result.url);
        }
      }
      
      const newGallery = [...data.gallery];
      newGallery[idx].images = [...(newGallery[idx].images || []), ...uploadedUrls];
      setData({ ...data, gallery: newGallery });
    } catch (err) {
      alert("Failed to append photos to activity.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhotoFromActivity = (actIdx: number, photoIdx: number) => {
    const newGallery = [...data.gallery];
    newGallery[actIdx].images = newGallery[actIdx].images.filter((_: any, i: number) => i !== photoIdx);
    setData({ ...data, gallery: newGallery });
  };

  const handleAddNewActivity = () => {
    if (!newAct.title || !newAct.date) {
      alert("Activity Title and Date are required!");
      return;
    }
    if (newAct.images.length === 0) {
      alert("Please upload at least one photo for this activity stack!");
      return;
    }

    const activityId = "act_" + Date.now().toString();
    const updatedGallery = [...(data.gallery || []), { ...newAct, id: activityId }];
    setData({ ...data, gallery: updatedGallery });
    setNewAct({ title: "", date: "", descEn: "", descTa: "", images: [] });
  };


  const handleAddStory = () => {
    if (!newStory.name || !newStory.quote) {
      alert("Name and Quote are required!");
      return;
    }
    const storyId = Date.now().toString();
    const updatedStories = [...(data.stories || []), { ...newStory, id: storyId }];
    setData({ ...data, stories: updatedStories });
    setNewStory({ name: "", role: "", quote: "", image: "" });
  };

  const handleDeleteStory = (idx: number) => {
    const updatedStories = data.stories.filter((_: any, i: number) => i !== idx);
    setData({ ...data, stories: updatedStories });
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-8 z-50 bg-vipro-purple text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <Settings className="w-6 h-6 animate-spin-slow" />
          <span className="absolute right-full mr-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Open CMS
          </span>
        </button>
      )}

      {/* Admin Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            data-lenis-prevent
            className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white dark:bg-[#1a0f1a] shadow-2xl z-[100] flex flex-col border-l border-gray-200 dark:border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-bold text-vipro-purple dark:text-vipro-beige flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                Live Editor
              </h2>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading || !data ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-vipro-purple" />
                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* Tabs */}
                  <div className="flex space-x-2 border-b border-gray-200 dark:border-white/10">
                    {["visibility", "content", "gallery", "impact", "contact"].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 font-medium text-sm capitalize border-b-2 transition-colors ${activeTab === tab ? "border-vipro-purple text-vipro-purple dark:text-vipro-beige dark:border-vipro-beige" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                      >
                        {tab === "contact" ? "Contact Info" : tab}
                      </button>
                    ))}
                  </div>

                  {/* VISIBILITY TAB */}
                  {activeTab === "visibility" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Toggle Sections On/Off</h3>
                      {Object.keys(data.sections)
                        .filter(section => section !== "donate" && section !== "volunteer" && section !== "events")
                        .map(section => (
                        <div key={section} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
                          <span className="font-medium capitalize text-gray-700 dark:text-gray-300">{section} Section</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={data.sections[section]}
                              onChange={(e) => setData({
                                ...data, 
                                sections: { ...data.sections, [section]: e.target.checked }
                              })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vipro-purple"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CONTENT TAB */}
                  {activeTab === "content" && (
                    <div className="space-y-8">
                      {Object.keys(data.content)
                        .filter(section => section !== "contact")
                        .map(section => (
                          <div key={section} className="space-y-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                            <h3 className="text-lg font-bold capitalize text-vipro-purple dark:text-vipro-beige">{section}</h3>
                            {Object.keys(data.content[section]).map(field => {
                              const val = data.content[section][field];

                            // Custom Logo Uploader
                            if (field === "logo") {
                              return (
                                <div key={field} className="space-y-2">
                                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">{field}</label>
                                  <div className="flex items-center space-x-6 bg-white dark:bg-black/35 p-5 rounded-2xl border border-gray-200 dark:border-white/10">
                                    <div className="w-20 h-20 rounded-2xl border border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center bg-gray-50 dark:bg-black/20 overflow-hidden shrink-0 relative group">
                                      {val ? (
                                        <img src={val} alt="Logo Preview" className="max-w-full max-h-full object-contain p-2" />
                                      ) : (
                                        <span className="text-[10px] text-gray-400 text-center px-1 font-medium">No Logo Uploaded</span>
                                      )}
                                      {uploadingLogo && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col space-y-2.5">
                                      <div className="flex space-x-2">
                                        <label className="px-4 py-2 bg-vipro-purple hover:bg-vipro-purple-light text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center space-x-1.5 shadow-md shadow-vipro-purple/20">
                                          <Upload className="w-3.5 h-3.5" />
                                          <span>{val ? "Change Logo" : "Upload Logo"}</span>
                                          <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            disabled={uploadingLogo}
                                            onChange={async (e) => {
                                              if (!e.target.files || !e.target.files[0]) return;
                                              const file = e.target.files[0];
                                              setUploadingLogo(true);
                                              try {
                                                // Upload original file directly to preserve full HD quality and native transparency
                                                const formData = new FormData();
                                                formData.append("file", file);
                                                
                                                const res = await fetch("/api/upload", {
                                                  method: "POST",
                                                  body: formData,
                                                });
                                                const result = await res.json();
                                                if (result.success) {
                                                  setData({
                                                    ...data,
                                                    content: {
                                                      ...data.content,
                                                      general: {
                                                        ...data.content.general,
                                                        logo: result.url
                                                      }
                                                    }
                                                  });
                                                } else {
                                                  alert("Logo upload failed.");
                                                }
                                              } catch (err) {
                                                alert("Logo upload failed.");
                                              } finally {
                                                setUploadingLogo(false);
                                              }
                                            }}
                                          />
                                        </label>
                                        {val && (
                                          <button
                                            type="button"
                                            disabled={uploadingLogo}
                                            onClick={() => setData({
                                              ...data,
                                              content: {
                                                ...data.content,
                                                general: {
                                                  ...data.content.general,
                                                  logo: ""
                                                }
                                              }
                                            })}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-md shadow-red-500/20"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Remove</span>
                                          </button>
                                        )}
                                      </div>
                                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                        Full HD Quality. Uploads files directly as-is to support transparent PNG or SVG logo files perfectly.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (field === "stats" && Array.isArray(val)) {
                              return (
                                <div key={field} className="space-y-3 pt-2">
                                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                                    Impact Metrics / Statistics
                                  </label>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {val.map((stat: any, sIdx: number) => (
                                      <div key={sIdx} className="p-4 bg-white dark:bg-black/35 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3 shadow-sm hover:border-vipro-purple/30 transition-all">
                                        <div className="text-xs font-bold text-vipro-purple dark:text-vipro-gold">
                                          Metric #{sIdx + 1}: {stat.label}
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="col-span-2 space-y-1">
                                            <label className="text-[10px] text-gray-500 font-medium">Label</label>
                                            <input 
                                              type="text"
                                              value={stat.label || ""}
                                              onChange={(e) => {
                                                const newStats = [...val];
                                                newStats[sIdx] = { ...stat, label: e.target.value };
                                                setData({
                                                  ...data,
                                                  content: {
                                                    ...data.content,
                                                    [section]: {
                                                      ...data.content[section],
                                                      stats: newStats
                                                    }
                                                  }
                                                });
                                              }}
                                              className="w-full px-2 py-1.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-xs font-medium"
                                              placeholder="e.g. Women Empowered"
                                            />
                                          </div>
                                          
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-gray-500 font-medium">Value</label>
                                            <input 
                                              type="text"
                                              value={stat.value !== undefined ? stat.value : ""}
                                              onChange={(e) => {
                                                const newStats = [...val];
                                                const rawVal = e.target.value;
                                                const numVal = rawVal === "" ? "" : isNaN(Number(rawVal)) ? rawVal : Number(rawVal);
                                                newStats[sIdx] = { ...stat, value: numVal };
                                                setData({
                                                  ...data,
                                                  content: {
                                                    ...data.content,
                                                    [section]: {
                                                      ...data.content[section],
                                                      stats: newStats
                                                    }
                                                  }
                                                });
                                              }}
                                              className="w-full px-2 py-1.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-xs font-bold"
                                              placeholder="e.g. 5000"
                                            />
                                          </div>
                                        </div>

                                        <div className="space-y-1">
                                          <label className="text-[10px] text-gray-500 font-medium">Suffix (Optional)</label>
                                          <input 
                                            type="text"
                                            value={stat.suffix || ""}
                                            onChange={(e) => {
                                              const newStats = [...val];
                                              newStats[sIdx] = { ...stat, suffix: e.target.value };
                                              setData({
                                                ...data,
                                                content: {
                                                  ...data.content,
                                                  [section]: {
                                                    ...data.content[section],
                                                    stats: newStats
                                                  }
                                                }
                                              });
                                            }}
                                            className="w-full px-2 py-1.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-xs"
                                            placeholder="e.g. +"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }

                            if (typeof val === "string") {
                              return (
                                <div key={field} className="space-y-1">
                                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">{field}</label>
                                  {val.length > 50 ? (
                                    <textarea 
                                      rows={3}
                                      value={val}
                                      onChange={(e) => setData({
                                        ...data, 
                                        content: { ...data.content, [section]: { ...data.content[section], [field]: e.target.value } }
                                      })}
                                      className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-vipro-purple focus:border-vipro-purple outline-none resize-none"
                                    />
                                  ) : (
                                    <input 
                                      type="text"
                                      value={val}
                                      onChange={(e) => setData({
                                        ...data, 
                                        content: { ...data.content, [section]: { ...data.content[section], [field]: e.target.value } }
                                      })}
                                      className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-vipro-purple focus:border-vipro-purple outline-none"
                                    />
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CONTACT INFO TAB */}
                  {activeTab === "contact" && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl space-y-6">
                        <h3 className="text-lg font-bold text-vipro-purple dark:text-vipro-beige">Director Profile</h3>
                        
                        {/* Director Portrait Upload */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">Director Image</label>
                          <div className="flex items-center space-x-6 bg-white dark:bg-black/35 p-5 rounded-2xl border border-gray-200 dark:border-white/10">
                            <div className="w-20 h-20 rounded-2xl border border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center bg-gray-50 dark:bg-black/20 overflow-hidden shrink-0 relative group">
                              {data.content.contact?.directorImage ? (
                                <img 
                                  src={data.content.contact.directorImage} 
                                  alt="Director Preview" 
                                  onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop";
                                  }}
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <span className="text-[10px] text-gray-400 text-center px-1 font-medium">No Image Uploaded</span>
                              )}
                              {uploadingDirector && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col space-y-2.5">
                              <div className="flex space-x-2">
                                <label className="px-4 py-2 bg-vipro-purple hover:bg-vipro-purple-light text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center space-x-1.5 shadow-md shadow-vipro-purple/20">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{data.content.contact?.directorImage ? "Change Image" : "Upload Image"}</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    disabled={uploadingDirector}
                                    onChange={async (e) => {
                                      if (!e.target.files || !e.target.files[0]) return;
                                      const rawFile = e.target.files[0];
                                      setUploadingDirector(true);
                                      try {
                                        const file = await compressImage(rawFile, 1000, 1000, 0.7);
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        
                                        const res = await fetch("/api/upload", {
                                          method: "POST",
                                          body: formData,
                                        });
                                        const result = await res.json();
                                        if (result.success) {
                                          setData({
                                            ...data,
                                            content: {
                                              ...data.content,
                                              contact: {
                                                ...data.content.contact,
                                                directorImage: result.url
                                              }
                                            }
                                          });
                                        } else {
                                          alert("Director image upload failed.");
                                        }
                                      } catch (err) {
                                        alert("Director image uploader error.");
                                      } finally {
                                        setUploadingDirector(false);
                                      }
                                    }}
                                  />
                                </label>
                                {data.content.contact?.directorImage && (
                                  <button
                                    type="button"
                                    disabled={uploadingDirector}
                                    onClick={() => setData({
                                      ...data,
                                      content: {
                                        ...data.content,
                                        contact: {
                                          ...data.content.contact,
                                          directorImage: ""
                                        }
                                      }
                                    })}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-md shadow-red-500/20"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Remove</span>
                                  </button>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                Uploads the image directly as-is to preserve high quality.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Phone, Email, Address, and Google Maps inputs */}
                      <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl space-y-4">
                        <h3 className="text-lg font-bold text-vipro-purple dark:text-vipro-beige">Contact Information</h3>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number 1</label>
                            <input 
                              type="text"
                              value={data.content.contact?.phone1 || ""}
                              onChange={(e) => setData({
                                ...data,
                                content: {
                                  ...data.content,
                                  contact: {
                                    ...data.content.contact,
                                    phone1: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-vipro-purple focus:border-vipro-purple outline-none"
                              placeholder="+91 98765 43210"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number 2</label>
                            <input 
                              type="text"
                              value={data.content.contact?.phone2 || ""}
                              onChange={(e) => setData({
                                ...data,
                                content: {
                                  ...data.content,
                                  contact: {
                                    ...data.content.contact,
                                    phone2: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-vipro-purple focus:border-vipro-purple outline-none"
                              placeholder="+91 12345 67890"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address 1</label>
                            <input 
                              type="email"
                              value={data.content.contact?.email1 || ""}
                              onChange={(e) => setData({
                                ...data,
                                content: {
                                  ...data.content,
                                  contact: {
                                    ...data.content.contact,
                                    email1: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-vipro-purple focus:border-vipro-purple outline-none"
                              placeholder="contact@vipro.org"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Address 2</label>
                            <input 
                              type="email"
                              value={data.content.contact?.email2 || ""}
                              onChange={(e) => setData({
                                ...data,
                                content: {
                                  ...data.content,
                                  contact: {
                                    ...data.content.contact,
                                    email2: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-vipro-purple focus:border-vipro-purple outline-none"
                              placeholder="support@vipro.org"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Head Office Address</label>
                          <textarea 
                            rows={3}
                            value={data.content.contact?.headoffice || ""}
                            onChange={(e) => setData({
                              ...data,
                              content: {
                                ...data.content,
                                contact: {
                                  ...data.content.contact,
                                  headoffice: e.target.value
                                }
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-vipro-purple focus:border-vipro-purple outline-none resize-none"
                            placeholder="Enter Office Address..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Google Maps Location Link / Coordinates</label>
                          <input 
                            type="text"
                            value={data.content.contact?.mapLink || ""}
                            onChange={(e) => setData({
                              ...data,
                              content: {
                                ...data.content,
                                contact: {
                                  ...data.content.contact,
                                  mapLink: e.target.value
                                }
                              }
                            })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-vipro-purple focus:border-vipro-purple outline-none"
                            placeholder="https://maps.app.goo.gl/..."
                          />
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            Supports Google Maps share links, full address search strings, or latitude,longitude coordinates (e.g. 12.205636,78.311144).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GALLERY TAB */}
                  {activeTab === "gallery" && (
                    <div className="space-y-8">
                      {/* Section Header */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Manage Activity Gallery</h3>
                        <p className="text-gray-500 text-sm">Create activities, specify their date, write English/Tamil descriptions, and upload multiple photos to stack under them.</p>
                      </div>

                      {/* CREATE NEW ACTIVITY BUILDER BOX */}
                      <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 space-y-6">
                        <h4 className="text-md font-bold text-vipro-purple dark:text-vipro-beige">Add New Activity Stack</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Activity Title / Category</label>
                            <input
                              type="text"
                              value={newAct.title}
                              onChange={(e) => setNewAct(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g. Self-Help Group Meetings"
                              className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-xl focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-sm font-semibold"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Activity Date</label>
                            <input
                              type="date"
                              value={newAct.date}
                              onChange={(e) => setNewAct(prev => ({ ...prev, date: e.target.value }))}
                              className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-xl focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-sm font-semibold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Description (English)</label>
                            <textarea
                              rows={2}
                              value={newAct.descEn}
                              onChange={(e) => setNewAct(prev => ({ ...prev, descEn: e.target.value }))}
                              placeholder="English details shown on card hover..."
                              className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-xl focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-sm resize-none"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Description (Tamil)</label>
                            <textarea
                              rows={2}
                              value={newAct.descTa}
                              onChange={(e) => setNewAct(prev => ({ ...prev, descTa: e.target.value }))}
                              placeholder="தமிழ் விளக்கம் (மிதவை திரையில் தோன்றும்)..."
                              className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-xl focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-sm resize-none"
                            />
                          </div>
                        </div>

                        {/* Upload stacked photos box */}
                        <div className="space-y-3">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Upload Activity Photos (Stack)</label>
                          <div className="flex flex-wrap gap-4 items-center">
                            
                            {/* Photo selector dropzone button */}
                            <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/15 hover:border-vipro-purple dark:hover:border-vipro-beige flex flex-col items-center justify-center cursor-pointer transition-colors flex-shrink-0">
                              {uploadingActPhotos ? (
                                <Loader2 className="w-5 h-5 animate-spin text-vipro-purple" />
                              ) : (
                                <Upload className="w-5 h-5 text-gray-400" />
                              )}
                              <span className="text-[9px] text-gray-400 font-bold mt-1">Add Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={uploadingActPhotos}
                                onChange={handleActPhotoUpload}
                                className="hidden"
                              />
                            </label>

                            {/* Uploaded thumbnails strip */}
                            {newAct.images.map((imgUrl, photoIdx) => {
                              let displayUrl = imgUrl;
                              if (typeof imgUrl === 'string' && (imgUrl.includes("lh3.googleusercontent.com") || imgUrl.includes("drive.google.com"))) {
                                const match = imgUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || imgUrl.match(/id=([a-zA-Z0-9_-]+)/);
                                if (match) {
                                  displayUrl = `/api/image-proxy?id=${match[1]}`;
                                }
                              }
                              return (
                                <div key={photoIdx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex-shrink-0 group">
                                  <img 
                                    src={displayUrl} 
                                    onError={(e) => {
                                      e.currentTarget.src = "https://images.unsplash.com/photo-1593113565632-475269f8ed53?q=80&w=200&auto=format&fit=crop";
                                    }}
                                    className="w-full h-full object-cover" 
                                    alt="" 
                                  />
                                <button
                                  type="button"
                                  onClick={() => setNewAct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== photoIdx) }))}
                                  className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                          </div>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">Supports uploading multiple files at once. Upload files directly to stack them under this activity.</p>
                        </div>

                        {/* Submit activity button */}
                        <button
                          type="button"
                          onClick={handleAddNewActivity}
                          className="px-5 py-2.5 bg-vipro-purple text-white text-xs font-bold rounded-xl hover:bg-vipro-purple-light transition-all flex items-center space-x-1.5 shadow-md shadow-vipro-purple/20"
                        >
                          <span>Add Activity Stack</span>
                        </button>
                      </div>

                      {/* ACTIVITY STACKS MANAGER GRID */}
                      <div className="space-y-6 pt-4">
                        <h4 className="text-md font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-2">Active Stacks / Activities</h4>
                        
                        {data.gallery.length === 0 ? (
                          <div className="text-center py-10 text-gray-400 text-sm">No activity stacks uploaded yet. Use the form above to add your first stack!</div>
                        ) : (
                          <div className="space-y-6">
                            {data.gallery.map((act: any, actIdx: number) => (
                              <div key={act.id} className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col space-y-4">
                                
                                {/* Header section: title and date */}
                                <div className="flex justify-between items-start">
                                  <div className="space-y-1 text-left">
                                    <span className="px-2 py-0.5 bg-vipro-magenta/10 dark:bg-vipro-magenta/20 border border-vipro-magenta/25 text-vipro-magenta rounded-full text-[9px] font-bold uppercase tracking-wider">
                                      Activity #{actIdx + 1}
                                    </span>
                                    <div className="flex items-center space-x-3 mt-1">
                                      <input
                                        type="text"
                                        value={act.title || ""}
                                        onChange={(e) => {
                                          const newGallery = [...data.gallery];
                                          newGallery[actIdx].title = e.target.value;
                                          setData({ ...data, gallery: newGallery });
                                        }}
                                        className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-vipro-purple text-lg font-serif font-bold text-vipro-purple dark:text-vipro-beige outline-none focus:bg-white dark:focus:bg-black/40 px-1 py-0.5 rounded transition-all w-72"
                                        placeholder="Activity Title"
                                      />
                                      <input
                                        type="date"
                                        value={act.date || ""}
                                        onChange={(e) => {
                                          const newGallery = [...data.gallery];
                                          newGallery[actIdx].date = e.target.value;
                                          setData({ ...data, gallery: newGallery });
                                        }}
                                        className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-vipro-purple text-xs font-semibold text-gray-500 dark:text-gray-400 outline-none focus:bg-white dark:focus:bg-black/40 px-1 py-0.5 rounded transition-all"
                                      />
                                    </div>
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newGallery = data.gallery.filter((_: any, i: number) => i !== actIdx);
                                      setData({ ...data, gallery: newGallery });
                                    }}
                                    className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 rounded-xl transition-colors shrink-0"
                                    title="Delete Activity"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>

                                {/* Bilingual description fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description (English)</label>
                                    <textarea
                                      rows={2}
                                      value={act.descEn || ""}
                                      onChange={(e) => {
                                        const newGallery = [...data.gallery];
                                        newGallery[actIdx].descEn = e.target.value;
                                        setData({ ...data, gallery: newGallery });
                                      }}
                                      placeholder="English description..."
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-xs resize-none"
                                    />
                                  </div>

                                  <div className="space-y-1 text-left">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description (Tamil)</label>
                                    <textarea
                                      rows={2}
                                      value={act.descTa || ""}
                                      onChange={(e) => {
                                        const newGallery = [...data.gallery];
                                        newGallery[actIdx].descTa = e.target.value;
                                        setData({ ...data, gallery: newGallery });
                                      }}
                                      placeholder="தமிழ் விளக்கம்..."
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-xs resize-none"
                                    />
                                  </div>
                                </div>

                                {/* Photos Grid in stack */}
                                <div className="space-y-2 text-left pt-2">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Stacked Photos ({act.images?.length || 0})</label>
                                  <div className="flex flex-wrap gap-3 items-center">
                                    
                                    {/* Append new photos uploader button inside this activity stack */}
                                    <label className="w-16 h-16 rounded-xl border border-dashed border-gray-300 dark:border-white/15 hover:border-vipro-purple dark:hover:border-vipro-beige flex flex-col items-center justify-center cursor-pointer transition-colors flex-shrink-0 bg-white dark:bg-black/20 shadow-sm">
                                      <Upload className="w-4 h-4 text-gray-400" />
                                      <span className="text-[8px] text-gray-400 font-bold mt-0.5">Append</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleAppendPhotosToActivity(actIdx, e)}
                                        className="hidden"
                                      />
                                    </label>

                                    {/* Individual stacked thumbnails */}
                                    {(act.images || []).map((imgUrl: string, pIdx: number) => {
                                       let thumbUrl = imgUrl;
                                       if (typeof imgUrl === 'string' && (imgUrl.includes("lh3.googleusercontent.com") || imgUrl.includes("drive.google.com"))) {
                                         const match = imgUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || imgUrl.match(/id=([a-zA-Z0-9_-]+)/);
                                         if (match) {
                                           thumbUrl = `/api/image-proxy?id=${match[1]}`;
                                         }
                                       }
                                       return (
                                         <div key={pIdx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 flex-shrink-0 group shadow-sm bg-gray-100">
                                           <img 
                                             src={thumbUrl} 
                                             onError={(e) => {
                                               e.currentTarget.src = "https://images.unsplash.com/photo-1593113565632-475269f8ed53?q=80&w=200&auto=format&fit=crop";
                                             }}
                                             className="w-full h-full object-cover" 
                                             alt="" 
                                           />
                                           <button
                                             type="button"
                                             onClick={() => handleRemovePhotoFromActivity(actIdx, pIdx)}
                                             className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                             title="Remove photo from stack"
                                           >
                                             <X className="w-4 h-4" />
                                           </button>
                                         </div>
                                       );
                                     })}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TESTIMONIALS (IMPACT) TAB */}
                  {activeTab === "impact" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Manage Testimonials</h3>
                        <p className="text-gray-500 text-sm">Add, upload photos for, or delete testimonials representing VIPRO's community impact.</p>
                      </div>

                      {/* Add New Testimonial Form */}
                      <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 space-y-6">
                        <h4 className="text-md font-bold text-vipro-purple dark:text-vipro-beige">Add New Testimonial</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Name</label>
                            <input
                              type="text"
                              value={newStory.name}
                              onChange={(e) => setNewStory(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g. Lakshmi"
                              className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-xl focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Role / Designation</label>
                            <input
                              type="text"
                              value={newStory.role}
                              onChange={(e) => setNewStory(prev => ({ ...prev, role: e.target.value }))}
                              placeholder="e.g. Tailoring Entrepreneur"
                              className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-xl focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Quote / Story</label>
                          <textarea
                            rows={3}
                            value={newStory.quote}
                            onChange={(e) => setNewStory(prev => ({ ...prev, quote: e.target.value }))}
                            placeholder="Share the impact story..."
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-xl focus:ring-1 focus:ring-vipro-purple focus:border-vipro-purple outline-none resize-none text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Testimonial Image</label>
                          <div className="flex items-center space-x-4">
                            {newStory.image ? (
                              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-vipro-gold/30 flex-shrink-0">
                                <img src={newStory.image} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setNewStory(prev => ({ ...prev, image: "" }))}
                                  className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <label className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-white/15 hover:border-vipro-purple dark:hover:border-vipro-beige flex flex-col items-center justify-center cursor-pointer transition-colors flex-shrink-0">
                                {uploadingImage ? (
                                  <Loader2 className="w-5 h-5 animate-spin text-vipro-purple dark:text-vipro-beige" />
                                ) : (
                                  <Upload className="w-5 h-5 text-gray-400" />
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingImage}
                                  onChange={handleTestimonialImageUpload}
                                  className="hidden"
                                />
                              </label>
                            )}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {newStory.image ? (
                                <span className="text-green-500 font-medium">Image uploaded to Google Drive!</span>
                              ) : (
                                <span>Upload avatar from local drive (saved to Google Drive)</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddStory}
                          disabled={!newStory.name || !newStory.quote || uploadingImage}
                          className="w-full py-2.5 bg-vipro-purple text-white font-semibold rounded-xl hover:bg-vipro-purple-light transition-colors disabled:opacity-50 text-sm shadow-sm"
                        >
                          Add to Stories List
                        </button>
                      </div>

                      {/* Current Testimonials List */}
                      <div className="space-y-4">
                        <h4 className="text-md font-bold text-gray-900 dark:text-white">Active Stories ({data.stories?.length || 0})</h4>
                        
                        {(!data.stories || data.stories.length === 0) ? (
                          <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 text-gray-500 text-sm">
                            No testimonials loaded.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {data.stories.map((story: any, idx: number) => (
                              <div
                                key={story.id || idx}
                                className="flex items-start justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-150 dark:border-white/5 shadow-sm hover:border-vipro-purple/20 transition-all animate-fadeIn"
                              >
                                <div className="flex items-start space-x-4">
                                  {story.image ? (
                                    <img 
                                      src={story.image} 
                                      alt={story.name} 
                                      onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop";
                                      }}
                                      className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-white/10 flex-shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 flex-shrink-0">
                                      <User className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-bold text-gray-800 dark:text-white text-sm">{story.name}</span>
                                      {story.role && (
                                        <span className="text-xs text-gray-400 dark:text-gray-400">• {story.role}</span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 italic line-clamp-2">
                                      &quot;{story.quote}&quot;
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteStory(idx)}
                                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors flex-shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#120a12]">
              <button 
                onClick={handleSave}
                disabled={saving || !data}
                className="w-full py-4 bg-vipro-magenta text-white font-bold rounded-xl hover:bg-vipro-magenta-light transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 shadow-lg shadow-vipro-magenta/20"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Settings className="w-5 h-5" />}
                <span>Save & Apply Changes</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function LoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-[#251525] w-full max-w-md rounded-3xl shadow-2xl p-8 relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-vipro-purple/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-vipro-purple dark:text-vipro-beige" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-vipro-purple dark:text-vipro-beige">Admin Access</h2>
              <p className="text-gray-500 text-sm mt-2 text-center">Sign in to manage website content</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-vipro-purple focus:ring-1 focus:ring-vipro-purple outline-none text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-vipro-purple focus:ring-1 focus:ring-vipro-purple outline-none text-gray-900 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-vipro-purple hover:bg-vipro-purple-light text-white font-bold rounded-xl transition-colors disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
