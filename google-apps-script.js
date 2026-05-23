// =========================================================================
//                   VIPRO NGO - Google Apps Script Web App CMS
// =========================================================================
//
// HOW TO DEPLOY:
// 1. Open your Spreadsheet ➔ Click "Extensions" ➔ "Apps Script".
// 2. Paste this entire code into the editor (replacing any old code).
// 3. Save the project (Cmd+S / Ctrl+S).
// 4. Close and re-open your Spreadsheet. You will see a new menu at the top:
//    "VIPRO CMS Admin" ➔ Click "Initialize & Seed Database" to populate all tabs instantly!
// 5. Deploy the script: Click "Deploy" ➔ "New deployment".
// 6. Select "Web app" type, set Execute as "Me", and Who has access "Anyone".
// 7. Click Deploy, authorize all permissions, and copy the Web App URL!
//
// =========================================================================

// Built-in trigger to create custom admin menu in Google Spreadsheet UI
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('VIPRO CMS Admin')
      .addItem('Initialize & Seed Database', 'initializeSpreadsheet')
      .addToUi();
}

// Initialization routine to create all tabs and populate them with complete seed data
function initializeSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  
  try {
    // Helper to get or insert sheet
    function setupSheet(name) {
      var sheet = ss.getSheetByName(name);
      if (sheet) {
        sheet.clear();
      } else {
        sheet = ss.insertSheet(name);
      }
      return sheet;
    }
    
    // -------------------------------------
    // 1. Seed Visibility Tab
    // -------------------------------------
    var visSheet = setupSheet("Visibility");
    var visRows = [
      ["Section", "IsVisible"],
      ["hero", "TRUE"],
      ["about", "TRUE"],
      ["mission", "TRUE"],
      ["programs", "TRUE"],
      ["impact", "TRUE"],
      ["gallery", "TRUE"],
      ["donate", "FALSE"],
      ["volunteer", "FALSE"],
      ["events", "FALSE"],
      ["contact", "TRUE"]
    ];
    visSheet.getRange(1, 1, visRows.length, 2).setValues(visRows);
    
    // -------------------------------------
    // 2. Seed Content Tab
    // -------------------------------------
    var conSheet = setupSheet("Content");
    
    var statsSeed = [
      { "label": "Women Empowered", "value": 5000, "suffix": "+" },
      { "label": "SHGs Supported", "value": 350, "suffix": "+" },
      { "label": "Training Programs", "value": 120, "suffix": "+" },
      { "label": "Families Benefited", "value": 20000, "suffix": "+" }
    ];
    
    var pointsSeed = [
      "Empower women economically and socially",
      "Support micro-entrepreneurship and self-reliance",
      "Create sustainable livelihood opportunities through skill training"
    ];
    
    var conRows = [
      ["Section", "Field", "Value"],
      // General metrics
      ["general", "logo", "/logo.png"],
      ["general", "instagram", "https://instagram.com/viprongotamilnadu"],
      ["general", "facebook", "https://facebook.com/viprongo"],
      ["general", "x", "https://x.com/viprongo"],
      ["general", "whatsapp", "https://wa.me/919876543210"],
      // Hero section
      ["hero", "headline", "Empowering Women."],
      ["hero", "subheadline", "Transforming Communities."],
      ["hero", "description", "VIPRO is building a stronger future for women through skill development, self-help groups, employment opportunities, and sustainable empowerment."],
      ["hero", "stats", JSON.stringify(statsSeed)],
      // About section
      ["about", "title", "A Journey of Hope & Empowerment"],
      ["about", "description1", "For over a decade, VIPRO has been at the forefront of social transformation. We believe that when you empower a woman, you empower a family, a community, and ultimately, a nation."],
      ["about", "description2", "Through targeted interventions in rural and urban areas, we provide women with the tools they need—be it through Self-Help Groups (SHGs), rigorous skill development, or access to livelihood opportunities—to rewrite their destinies."],
      // Mission / Vision
      ["mission", "missionTitle", "Our Mission"],
      ["mission", "missionPoints", JSON.stringify(pointsSeed)],
      ["mission", "visionTitle", "Our Vision"],
      ["mission", "visionText", "A self-reliant society where women lead community transformation, inspiring generations to build an equitable and prosperous future for all."],
      // Contact & Map coordinates
      ["contact", "directorImage", "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop"],
      ["contact", "phone1", "+91 90955 15949"],
      ["contact", "phone2", ""],
      ["contact", "email1", "viprog127@gmail.com"],
      ["contact", "email2", ""],
      ["contact", "headoffice", "45, MGR Nagar, Kambainallur,\nDharmapuri District,\nKarimangalam Taluk, 635202"],
      ["contact", "mapLink", "https://maps.app.goo.gl/dez7vr4AwcfmEiGo7"]
    ];
    conSheet.getRange(1, 1, conRows.length, 3).setValues(conRows);
    
    // -------------------------------------
    // 3. Seed Gallery Tab (Bilingual Activity Stacks)
    // -------------------------------------
    var galSheet = setupSheet("Gallery");
    
    var shgImages = [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop"
    ];
    
    var skillImages = [
      "https://images.unsplash.com/photo-1574681656839-e41c4a01c80b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=800&auto=format&fit=crop"
    ];
    
    var communityImages = [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=800&auto=format&fit=crop"
    ];

    var galRows = [
      ["ID", "Date", "Title", "DescEn", "DescTa", "Images"],
      [
        "act_1",
        "2026-04-15",
        "Self-Help Group Meetings",
        "Self-Help Group members discussing microfinance and local community development goals.",
        "சுயஉதவி குழு உறுப்பினர்கள் நுண்கடன் மற்றும் உள்ளூர் கிராம வளர்ச்சி குறித்து விவாதித்தல்.",
        JSON.stringify(shgImages)
      ],
      [
        "act_2",
        "2026-05-10",
        "Vocational Skill Training",
        "Women undergoing rigorous computer literacy and professional tailoring classes for self-employment.",
        "சுயதொழில் வாய்ப்புகளுக்காக பெண்கள் கணினி மற்றும் தொழில்முறை தையல் பயிற்சி பெறுதல்.",
        JSON.stringify(skillImages)
      ],
      [
        "act_3",
        "2026-05-20",
        "Community Development Projects",
        "Village community members actively building sustainable infrastructure and learning aids.",
        "கிராம மக்கள் தங்களது பகுதிகளில் நிலையான உள்கட்டமைப்பு வசதிகளை தாங்களாகவே ஏற்படுத்துதல்.",
        JSON.stringify(communityImages)
      ]
    ];
    galSheet.getRange(1, 1, galRows.length, 6).setValues(galRows);
    
    // -------------------------------------
    // 4. Seed Impact Tab
    // -------------------------------------
    var impSheet = setupSheet("Impact");
    var impRows = [
      ["ID", "Name", "Role", "Quote", "Image"],
      [
        "1",
        "Lakshmi",
        "Tailoring Entrepreneur",
        "VIPRO's tailoring program didn't just teach me how to sew; it taught me how to dream. Today, I employ three other women in my village.",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
      ],
      [
        "2",
        "Meena",
        "SHG Leader",
        "Through the financial literacy training, our SHG has saved enough to start a small dairy business. We are now financially independent.",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop"
      ],
      [
        "3",
        "Saraswathi",
        "Handicrafts Maker",
        "I thought my lack of education was a barrier. VIPRO helped me realize my worth. My handicrafts are now sold across the state.",
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=600&auto=format&fit=crop"
      ]
    ];
    impSheet.getRange(1, 1, impRows.length, 5).setValues(impRows);
    
    ui.alert("Success", "VIPRO database initialized and seeded successfully! Ready for your website connections.", ui.ButtonSet.OK);
  } catch (err) {
    ui.alert("Error", "Initialization failed: " + err.toString(), ui.ButtonSet.OK);
  }
}

// GET Endpoint for Next.js - Returns entire parsed dynamic database
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Parse Visibility
    var sections = {};
    try {
      var visSheet = ss.getSheetByName("Visibility");
      if (visSheet) {
        var visRows = visSheet.getDataRange().getValues();
        for (var i = 1; i < visRows.length; i++) {
          if (visRows[i][0]) {
            sections[visRows[i][0].toString().toLowerCase()] = visRows[i][1] === true || visRows[i][1] === "TRUE";
          }
        }
      }
    } catch (err) {}
    
    // Ensure required visibility defaults exist
    var requiredVis = ["hero", "about", "mission", "programs", "impact", "gallery", "donate", "volunteer", "events", "contact"];
    requiredVis.forEach(function(s) {
      if (sections[s] === undefined) sections[s] = true;
    });

    // 2. Parse Content
    var content = {};
    try {
      var conSheet = ss.getSheetByName("Content");
      if (conSheet) {
        var conRows = conSheet.getDataRange().getValues();
        for (var i = 1; i < conRows.length; i++) {
          var sec = conRows[i][0];
          var field = conRows[i][1];
          var val = conRows[i][2];
          if (sec && field) {
            var secLower = sec.toString().toLowerCase();
            if (!content[secLower]) content[secLower] = {};
            
            if (field === "stats" || field === "missionPoints") {
              try {
                content[secLower][field] = JSON.parse(val.toString());
              } catch (pErr) {
                content[secLower][field] = [];
              }
            } else {
              content[secLower][field] = val.toString();
            }
          }
        }
      }
    } catch (err) {}

    // 3. Parse Gallery Activities
    var gallery = [];
    try {
      var galSheet = ss.getSheetByName("Gallery");
      if (galSheet) {
        var galRows = galSheet.getDataRange().getValues();
        for (var i = 1; i < galRows.length; i++) {
          if (galRows[i][0]) {
            var imagesJson = galRows[i][5] ? galRows[i][5].toString() : "[]";
            var parsedImages = [];
            try {
              parsedImages = JSON.parse(imagesJson);
            } catch (jsonErr) {
              // Fallback: If it's a single raw URL string, package it as an array
              var rawStr = galRows[i][5].toString().trim();
              if (rawStr) {
                parsedImages = [rawStr];
              }
            }
            
            gallery.push({
              id: galRows[i][0].toString(),
              date: galRows[i][1] ? galRows[i][1].toString() : "",
              title: galRows[i][2] ? galRows[i][2].toString() : "",
              descEn: galRows[i][3] ? galRows[i][3].toString() : "",
              descTa: galRows[i][4] ? galRows[i][4].toString() : "",
              images: parsedImages
            });
          }
        }
      }
    } catch (err) {}

    // 4. Parse Impact Stories
    var stories = [];
    try {
      var impSheet = ss.getSheetByName("Impact");
      if (impSheet) {
        var impRows = impSheet.getDataRange().getValues();
        for (var i = 1; i < impRows.length; i++) {
          if (impRows[i][0]) {
            stories.push({
              id: impRows[i][0].toString(),
              name: impRows[i][1].toString(),
              role: impRows[i][2] ? impRows[i][2].toString() : "",
              quote: impRows[i][3] ? impRows[i][3].toString() : "",
              image: impRows[i][4] ? impRows[i][4].toString() : ""
            });
          }
        }
      }
    } catch (err) {}

    var result = {
      sections: sections,
      content: content,
      gallery: gallery,
      stories: stories
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (globalErr) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: globalErr.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// POST Endpoint for Next.js - Handles uploads and database saving
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    
    // -------------------------------------
    // File Upload Action (Drive Storage)
    // -------------------------------------
    if (payload.action === 'upload') {
      var folderName = "VIPRO_Uploads";
      var folders = DriveApp.getFoldersByName(folderName);
      var folder;
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(folderName);
      }
      
      // Decode Base64 data from payload
      var rawBytes = Utilities.base64Decode(payload.base64Data);
      var blob = Utilities.newBlob(rawBytes, payload.contentType, payload.fileName);
      
      // Save file inside the folder
      var file = folder.createFile(blob);
      
      // Make the file publicly viewable
      file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
      
      // Construct premium direct CDN link
      var imageUrl = "https://lh3.googleusercontent.com/d/" + file.getId();
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        url: imageUrl
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // -------------------------------------
    // Database Save Action (Sheets Update)
    // -------------------------------------
    var data = payload;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Helper function to create sheet if it doesn't exist
    function getOrCreateSheet(name) {
      var sheet = ss.getSheetByName(name);
      if (!sheet) {
        sheet = ss.insertSheet(name);
      }
      return sheet;
    }
    
    // 1. Update Visibility
    var visSheet = getOrCreateSheet("Visibility");
    visSheet.clear();
    var visRows = [["Section", "IsVisible"]];
    for (var key in data.sections) {
      visRows.push([key, data.sections[key] ? "TRUE" : "FALSE"]);
    }
    visSheet.getRange(1, 1, visRows.length, 2).setValues(visRows);
    
    // 2. Update Content
    var conSheet = getOrCreateSheet("Content");
    conSheet.clear();
    var conRows = [["Section", "Field", "Value"]];
    for (var sec in data.content) {
      for (var fld in data.content[sec]) {
        var val = data.content[sec][fld];
        var stringVal = val;
        if (typeof val === 'object') {
          stringVal = JSON.stringify(val);
        }
        conRows.push([sec, fld, stringVal]);
      }
    }
    conSheet.getRange(1, 1, conRows.length, 3).setValues(conRows);
    
    // 3. Update Gallery Activities
    var galSheet = getOrCreateSheet("Gallery");
    galSheet.clear();
    var galRows = [["ID", "Date", "Title", "DescEn", "DescTa", "Images"]];
    (data.gallery || []).forEach(function(act) {
      var imagesStr = Array.isArray(act.images) ? JSON.stringify(act.images) : "[]";
      galRows.push([act.id, act.date || "", act.title || "", act.descEn || "", act.descTa || "", imagesStr]);
    });
    galSheet.getRange(1, 1, galRows.length, 6).setValues(galRows);
    
    // 4. Update Impact
    var impSheet = getOrCreateSheet("Impact");
    impSheet.clear();
    var impRows = [["ID", "Name", "Role", "Quote", "Image"]];
    (data.stories || []).forEach(function(story) {
      impRows.push([story.id, story.name, story.role || "", story.quote || "", story.image || ""]);
    });
    impSheet.getRange(1, 1, impRows.length, 5).setValues(impRows);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (postErr) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: postErr.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
