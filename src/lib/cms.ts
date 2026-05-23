function extractMapsQuery(url: string, fallbackAddress: string): string {
  // Try to find the coordinate from data parameter (which is the exact pin position)
  const dataCoordMatch = url.match(/3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (dataCoordMatch) {
    return `${dataCoordMatch[1]},${dataCoordMatch[2]}`;
  }
  
  // Try to find the place query
  const placeMatch = url.match(/\/place\/([^/]+)/);
  if (placeMatch) {
    try {
      return decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    } catch (e) {
      // Ignore decode error
    }
  }

  // Try to find the standard @lat,lng
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    return `${atMatch[1]},${atMatch[2]}`;
  }

  // Fallback to cleaned fallbackAddress
  return fallbackAddress
    .replace(/\r?\n/g, ", ")
    .replace(/\s+/g, " ")
    .replace(/Karimangalam\s+Talurk/gi, "Karimangalam Taluk")
    .trim();
}

export async function fetchCmsData() {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!url) {
    throw new Error("Missing GOOGLE_APPS_SCRIPT_URL in environment variables.");
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 0 } // Prevent fetch caching to ensure live data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch CMS data from Apps Script: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const sections = data.sections || {};
    const content = data.content || {};
    const gallery = data.gallery || [];
    const stories = data.stories || [];

    // Ensure general section always exists for logo uploader and social links
    const defaultLogoUrl = "/logo.png";
    if (!content.general) {
      content.general = { 
        logo: defaultLogoUrl,
        instagram: "https://instagram.com/viprongotamilnadu",
        facebook: "https://facebook.com/viprongo",
        x: "https://x.com/viprongo",
        whatsapp: "https://wa.me/919876543210"
      };
    } else {
      if (!content.general.logo || content.general.logo.startsWith("data:image/") || content.general.logo.includes("drive.google.com")) {
        content.general.logo = defaultLogoUrl;
      }
      if (!content.general.instagram) {
        content.general.instagram = "https://instagram.com/viprongotamilnadu";
      }
      if (!content.general.facebook) {
        content.general.facebook = "https://facebook.com/viprongo";
      }
      if (!content.general.x) {
        content.general.x = "https://x.com/viprongo";
      }
      if (!content.general.whatsapp) {
        content.general.whatsapp = "https://wa.me/919876543210";
      }
    }

    if (!content.contact) {
      content.contact = {
        directorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
        phone1: "+91 98765 43210",
        phone2: "",
        email1: "contact@vipro.org",
        email2: "",
        headoffice: "123 Empowerment Way, VIPRO Building, Near Community Center, Chennai, Tamil Nadu, India - 600001",
        mapLink: "https://maps.app.goo.gl/dez7vr4AwcfmEiGo7"
      };
    } else {
      if (!content.contact.directorImage) {
        content.contact.directorImage = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop";
      }
      if (content.contact.phone1 === undefined || content.contact.phone1 === null) {
        content.contact.phone1 = "+91 98765 43210";
      }
      if (content.contact.phone2 === undefined || content.contact.phone2 === null) {
        content.contact.phone2 = "";
      }
      if (content.contact.email1 === undefined || content.contact.email1 === null) {
        content.contact.email1 = "contact@vipro.org";
      }
      if (content.contact.email2 === undefined || content.contact.email2 === null) {
        content.contact.email2 = "";
      }
      if (!content.contact.headoffice) {
        content.contact.headoffice = "123 Empowerment Way, VIPRO Building, Near Community Center, Chennai, Tamil Nadu, India - 600001";
      }
      if (!content.contact.mapLink) {
        content.contact.mapLink = "https://maps.app.goo.gl/dez7vr4AwcfmEiGo7";
      }
    }

    // Resolve mapLink if it is a short link
    if (content.contact && content.contact.mapLink) {
      let resolvedUrl = content.contact.mapLink;
      if (content.contact.mapLink.includes("maps.app.goo.gl")) {
        try {
          const res = await fetch(content.contact.mapLink, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache the redirect resolution for 1 hour
          });
          resolvedUrl = res.url;
        } catch (e) {
          console.error("Error resolving short maps URL:", e);
        }
      }
      
      // Extract the exact query/coordinates
      content.contact.mapQuery = extractMapsQuery(resolvedUrl, content.contact.headoffice || "");
    }

    return { sections, content, gallery, stories };
  } catch (error) {
    console.error("Error fetching from Google Apps Script Web App:", error);
    throw error;
  }
}
