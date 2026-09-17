/**
 * Personal Knowledge Base and System Configuration
 * Source of Truth for Shadid Ahamed Portfolio
 */

export const SHADID_DATA = {
  profile: {
    fullName: "Shadid Ahamed",
    nativeName: "সাদীদ আহমেদ",
    primaryIdentity: "Architecture / Creative Developer / Designer / Artist / Web Developer",
    location: "17 no. / 15-by, Flat 24, Paltan Thana, Dhaka, Bangladesh",
    mapsUrl: "https://maps.google.com/?q=Paltan+Thana+Dhaka+Bangladesh",
    academicContext: {
      university: "BRAC University",
      department: "Architecture",
      startedYear: 2026,
      batch: "Summer 2026",
      roleNumber: "1000061008",
      expectedPassingYear: 2032,
      academicDirection: "Currently studying in the Architecture Department and exploring / working toward a transition into CSE.",
      coursework: "ARC 101 / Design-related coursework and architectural model / studio work."
    },
    bioText: `If I had to tell someone who Shadid was, I would not begin with his results. I would speak about his curiosity—how he looks at a building not just as brick and mortar, but as spatial logic, light, and geometry; how he looks at code not merely as syntax, but as a digital canvas for storytelling.`
  },

  education: [
    {
      id: "school",
      type: "SCHOOL",
      institution: "Motijheel Ideal School and College",
      location: "Motijheel, Dhaka, Bangladesh",
      period: "2013 – 2023",
      classes: "Class 1 – Class 10",
      background: "Science",
      qualification: "Secondary School Certificate (SSC)",
      gpa: "5.00",
      achievement: "Golden A+",
      gallery: [
        "assets/images/education/school_1.jpg",
        "assets/images/education/school_2.jpg",
        "assets/images/education/school_3.jpg"
      ]
    },
    {
      id: "college",
      type: "COLLEGE",
      institution: "Notre Dame College",
      location: "Arambagh, Motijheel, Dhaka, Bangladesh",
      period: "2023 – 2025",
      batch: "2025",
      group: "Science (Group 1)",
      classRoll: "20",
      collegeRoll: "125019",
      qualification: "Higher Secondary Certificate (HSC)",
      gpa: "5.00",
      achievement: "Golden A+",
      gallery: [
        "assets/images/education/ndc_1.jpg",
        "assets/images/education/ndc_2.jpg",
        "assets/images/education/ndc_3.jpg",
        "assets/images/education/ndc_4.jpg"
      ]
    },
    {
      id: "university",
      type: "UNIVERSITY",
      institution: "BRAC University",
      location: "Merul Badda, Dhaka, Bangladesh",
      period: "2026 – Present",
      batch: "Summer 2026",
      department: "Architecture",
      roleNumber: "1000061008",
      expectedPassingYear: 2032,
      academicDirection: "Exploring / working toward transition into CSE / Computer Science.",
      gallery: [
        "assets/images/education/brac_1.jpg",
        "assets/images/education/brac_2.jpg",
        "assets/images/education/brac_3.jpg"
      ]
    }
  ],

  cvLink: "https://drive.google.com/file/d/1pFIeAtxJgmMUcLbubDZjb6CgWmaHVTQV/view?usp=drive_link",

  socials: [
    { name: "Email", url: "mailto:shadidahamed.matashome05m@gmail.com", icon: "fas fa-envelope" },
    { name: "GitHub", url: "https://github.com/shadidahamed", icon: "fab fa-github" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/shadid-ahamed-41a0703b2/", icon: "fab fa-linkedin" },
    { name: "Instagram", url: "https://www.instagram.com/shade_ed25", icon: "fab fa-instagram" },
    { name: "Facebook", url: "https://www.facebook.com/share/1C2KcQfwvn/", icon: "fab fa-facebook" },
    { name: "WhatsApp", url: "https://wa.me/8801326162684", icon: "fab fa-whatsapp" },
    { name: "X", url: "https://x.com/ShadidAhamed", icon: "fab fa-x-twitter" },
    { name: "Pinterest", url: "https://pin.it/4Z5y34R2T", icon: "fab fa-pinterest" },
    { name: "Reddit", url: "https://www.reddit.com/user/Shade_ed25", icon: "fab fa-reddit" },
    { name: "Tumblr", url: "https://www.tumblr.com/", icon: "fab fa-tumblr" }
  ],

  videos: [
    {
      id: "video-1",
      title: "Modifiers English",
      url: "https://youtu.be/MCj4pNiJR_Q?si=pOBr9xrs4MTIZYPS",
      embedId: "MCj4pNiJR_Q"
    },
    {
      id: "video-2",
      title: "Connectors English",
      url: "https://youtu.be/K29JNurQr9c?si=WhIaSmjzuS6xFA1I",
      embedId: "K29JNurQr9c"
    },
    {
      id: "video-3",
      title: "Subject-Verb-Agreement",
      url: "https://youtu.be/0ba53jWZy5o?si=CoT3J1wrEhQz7OPg",
      embedId: "0ba53jWZy5o"
    }
  ],

  projects: {
    digital: [
      {
        id: "trendcart",
        name: "TrendCart",
        type: "Web Application",
        description: "Full-featured e-commerce frontend system with dynamic interaction logic.",
        liveUrl: "https://shadidahamed.github.io/trendcart/",
        actionText: "Open Live Project"
      },
      {
        id: "office-engine",
        name: "Office Engine / Shadid's Game",
        type: "Interactive Web Game Engine",
        description: "A custom interactive web/game project designed for real-time spatial interaction.",
        liveUrl: "https://shadidahamed.github.io/Shadid-s-game/",
        actionText: "Play Game"
      }
    ],
    architecture: [
      { id: "lorry-lift", name: "Laurie Lift / Lorry Lift", description: "Mechanical and architectural elevation study.", gallery: ["assets/images/architecture/lorry_1.jpg"] },
      { id: "squares-grids", name: "Squares and Grids", description: "Spatial distribution and grid alignments.", gallery: ["assets/images/architecture/grid_1.jpg"] },
      { id: "line-signatures", name: "Line Signatures", description: "Vector line weight dynamic explorations.", gallery: ["assets/images/architecture/line_1.jpg", "assets/images/architecture/line_2.jpg", "assets/images/architecture/line_3.jpg"] },
      { id: "3d-forms", name: "3D Forms", description: "Volumetric subtraction and massing operations.", gallery: ["assets/images/architecture/form_1.jpg"] },
      { id: "interlock", name: "Interlock", description: "Interlocking solid spatial relationships.", gallery: ["assets/images/architecture/interlock_top.jpg", "assets/images/architecture/interlock_exo.jpg", "assets/images/architecture/interlock_side.jpg"] },
      { id: "pavilion", name: "Pavilion", description: "Monsoon architectural pavilion concept (ARC101 SEASONSCAPE).", gallery: ["assets/images/architecture/pavilion_1.jpg"] },
      { id: "cutouts", name: "Cutouts / Section Cutouts", description: "Prism/grid processes and section cutouts.", gallery: ["assets/images/architecture/cutout_process.jpg", "assets/images/architecture/cutout_final.jpg"] },
      { id: "mosque", name: "Mosque Architectural Work", description: "Sacred spatial volumes and lighting studies.", gallery: ["assets/images/architecture/mosque_process.jpg", "assets/images/architecture/mosque_context.jpg"] }
    ],
    graphicsCount: 18,
    drawingCount: 20
  },

  achievements: {
    art: [
      { year: "2023", competition: "Bangladesh Art Competition", thana: "1st", district: "1st", division: "2nd" }
    ],
    fitness: {
      title: "5 km Running Achievement",
      status: "Runner-up",
      image: "assets/images/achievements/fitness-medal.jpg"
    },
    crests: [
      { title: "Notre Dame College Crest", type: "Academic Honor" },
      { title: "SSC GPA 5 Crest", type: "Academic Excellence" },
      { title: "HSC GPA 5 Crest", type: "Academic Excellence" },
      { title: "Badminton Referee Recognition Medal", type: "Sports Officiating" }
    ]
  },

  literature: {
    authors: [
      { name: "Samaresh Majumdar", books: ["Uttaradhikar", "Kalbela", "Kalpurush"] },
      { name: "Humayun Ahmed", books: ["Himu Series", "Amar Bondhu Rashed"] },
      { name: "Bibhutibhushan Bandyopadhyay", books: ["Pather Panchali"] },
      { name: "Kazi Nazrul Islam", note: "Strong interest in poetic rhythm and revolutionary works." },
      { name: "Michael Madhusudan Dutt", note: "Deep appreciation for classic epic literature and sonnets." }
    ],
    favoriteComic: "Protibastob by Dhaka Comics"
  }
};
