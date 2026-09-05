def generate_recommendations(missing_skills):
    recommendations = []

    learning_data = {

        # ============================================================
        # DATA SCIENCE
        # ============================================================

        "Python": {
            "priority": "High",
            "description": "Strengthen your Python programming foundation for data analysis, automation, and machine learning.",
            "topics": [
                "Python fundamentals",
                "Functions",
                "Object-oriented programming",
                "File handling",
                "Exception handling"
            ],
            "resources": [
                {
                    "name": "Python Official Tutorial",
                    "url": "https://docs.python.org/3/tutorial/"
                },
                {
                    "name": "W3Schools Python",
                    "url": "https://www.w3schools.com/python/"
                }
            ],
            "practice": "Build a Python project that reads a dataset, processes it, and generates useful results."
        },

        "SQL": {
            "priority": "High",
            "description": "Learn how to query, organize, and analyze data stored in relational databases.",
            "topics": [
                "SELECT queries",
                "WHERE conditions",
                "JOIN operations",
                "GROUP BY",
                "Subqueries",
                "Database design"
            ],
            "resources": [
                {
                    "name": "SQLBolt",
                    "url": "https://sqlbolt.com/"
                },
                {
                    "name": "W3Schools SQL",
                    "url": "https://www.w3schools.com/sql/"
                }
            ],
            "practice": "Create a student database and write SQL queries to analyze student performance."
        },

        "Pandas": {
            "priority": "High",
            "description": "Learn Pandas for cleaning, transforming, analyzing, and exploring structured datasets.",
            "topics": [
                "DataFrames",
                "Series",
                "Reading CSV files",
                "Data cleaning",
                "Filtering data",
                "GroupBy",
                "Missing values"
            ],
            "resources": [
                {
                    "name": "Pandas Getting Started",
                    "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/"
                },
                {
                    "name": "Kaggle Pandas Course",
                    "url": "https://www.kaggle.com/learn/pandas"
                }
            ],
            "practice": "Take a real CSV dataset and clean it, analyze it, and find at least five useful insights."
        },

        "NumPy": {
            "priority": "High",
            "description": "Build a strong foundation in numerical computing using NumPy arrays and mathematical operations.",
            "topics": [
                "Arrays",
                "Array indexing",
                "Array operations",
                "Broadcasting",
                "Mathematical functions",
                "Random numbers"
            ],
            "resources": [
                {
                    "name": "NumPy Learn",
                    "url": "https://numpy.org/learn/"
                },
                {
                    "name": "NumPy Documentation",
                    "url": "https://numpy.org/doc/stable/"
                }
            ],
            "practice": "Create a small numerical analysis project using NumPy arrays and statistical calculations."
        },

        "Statistics": {
            "priority": "High",
            "description": "Develop the statistical foundation needed for data analysis and machine learning.",
            "topics": [
                "Mean and median",
                "Variance",
                "Standard deviation",
                "Probability",
                "Distributions",
                "Correlation",
                "Hypothesis testing"
            ],
            "resources": [
                {
                    "name": "Khan Academy Statistics",
                    "url": "https://www.khanacademy.org/math/statistics-probability"
                },
                {
                    "name": "StatQuest",
                    "url": "https://www.youtube.com/@statquest"
                }
            ],
            "practice": "Analyze a dataset and calculate descriptive statistics and correlations."
        },

        "Machine Learning": {
            "priority": "High",
            "description": "Learn the fundamental concepts and workflow used to build machine learning models.",
            "topics": [
                "Supervised learning",
                "Unsupervised learning",
                "Training and testing",
                "Feature engineering",
                "Model evaluation",
                "Overfitting"
            ],
            "resources": [
                {
                    "name": "Google Machine Learning Crash Course",
                    "url": "https://developers.google.com/machine-learning/crash-course"
                },
                {
                    "name": "Kaggle Intro to Machine Learning",
                    "url": "https://www.kaggle.com/learn/intro-to-machine-learning"
                }
            ],
            "practice": "Build a simple machine learning model that predicts an outcome from a real dataset."
        },

        "Scikit-learn": {
            "priority": "High",
            "description": "Learn how to implement practical machine learning workflows using Scikit-learn.",
            "topics": [
                "Train-test split",
                "Regression",
                "Classification",
                "Random Forest",
                "Model evaluation",
                "Feature importance"
            ],
            "resources": [
                {
                    "name": "Scikit-learn Getting Started",
                    "url": "https://scikit-learn.org/stable/getting_started.html"
                },
                {
                    "name": "Scikit-learn User Guide",
                    "url": "https://scikit-learn.org/stable/user_guide.html"
                }
            ],
            "practice": "Train a classification or regression model and evaluate its performance."
        },

        "Data Visualization": {
            "priority": "High",
            "description": "Learn to communicate insights clearly through charts, dashboards, and visual storytelling.",
            "topics": [
                "Bar charts",
                "Line charts",
                "Scatter plots",
                "Histograms",
                "Matplotlib",
                "Dashboard design"
            ],
            "resources": [
                {
                    "name": "Kaggle Data Visualization",
                    "url": "https://www.kaggle.com/learn/data-visualization"
                },
                {
                    "name": "Matplotlib Tutorials",
                    "url": "https://matplotlib.org/stable/tutorials/"
                }
            ],
            "practice": "Create a dashboard that tells a clear story using at least five visualizations."
        },


        # ============================================================
        # WEB DEVELOPMENT / SOFTWARE
        # ============================================================

        "HTML": {
            "priority": "Medium",
            "description": "Learn how to structure modern web pages using semantic HTML.",
            "topics": [
                "HTML elements",
                "Forms",
                "Semantic HTML",
                "Links",
                "Tables",
                "Accessibility"
            ],
            "resources": [
                {
                    "name": "MDN HTML",
                    "url": "https://developer.mozilla.org/en-US/docs/Learn/HTML"
                },
                {
                    "name": "W3Schools HTML",
                    "url": "https://www.w3schools.com/html/"
                }
            ],
            "practice": "Build a personal portfolio webpage using semantic HTML."
        },

        "CSS": {
            "priority": "Medium",
            "description": "Learn how to create responsive, attractive, and user-friendly web interfaces.",
            "topics": [
                "Selectors",
                "Box model",
                "Flexbox",
                "Grid",
                "Responsive design",
                "Animations"
            ],
            "resources": [
                {
                    "name": "MDN CSS",
                    "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS"
                },
                {
                    "name": "CSS Tricks",
                    "url": "https://css-tricks.com/"
                }
            ],
            "practice": "Design a responsive portfolio website that works on desktop and mobile."
        },

        "JavaScript": {
            "priority": "High",
            "description": "Learn JavaScript fundamentals for creating interactive and dynamic web applications.",
            "topics": [
                "Variables",
                "Functions",
                "Arrays",
                "Objects",
                "DOM",
                "Async programming",
                "Fetch API"
            ],
            "resources": [
                {
                    "name": "MDN JavaScript",
                    "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript"
                },
                {
                    "name": "JavaScript.info",
                    "url": "https://javascript.info/"
                }
            ],
            "practice": "Build an interactive task manager using JavaScript."
        },

        "React": {
            "priority": "High",
            "description": "Learn React for building reusable and interactive user interfaces.",
            "topics": [
                "Components",
                "Props",
                "State",
                "Hooks",
                "Events",
                "API integration"
            ],
            "resources": [
                {
                    "name": "React Official Learn",
                    "url": "https://react.dev/learn"
                },
                {
                    "name": "React Documentation",
                    "url": "https://react.dev/"
                }
            ],
            "practice": "Build a dashboard with reusable React components and API data."
        },

        "TypeScript": {
            "priority": "Medium",
            "description": "Learn TypeScript to write safer and more maintainable JavaScript applications.",
            "topics": [
                "Types",
                "Interfaces",
                "Objects",
                "Generics",
                "Type narrowing",
                "React with TypeScript"
            ],
            "resources": [
                {
                    "name": "TypeScript Handbook",
                    "url": "https://www.typescriptlang.org/docs/handbook/"
                },
                {
                    "name": "TypeScript Playground",
                    "url": "https://www.typescriptlang.org/play"
                }
            ],
            "practice": "Convert a small JavaScript project into TypeScript."
        },

        "Git": {
            "priority": "Medium",
            "description": "Learn version control so you can manage projects and collaborate professionally.",
            "topics": [
                "Repositories",
                "Commits",
                "Branches",
                "Merge",
                "Pull requests",
                "GitHub"
            ],
            "resources": [
                {
                    "name": "Git Documentation",
                    "url": "https://git-scm.com/doc"
                },
                {
                    "name": "GitHub Skills",
                    "url": "https://skills.github.com/"
                }
            ],
            "practice": "Create a GitHub repository and manage a complete project using branches and commits."
        },

        "REST APIs": {
            "priority": "High",
            "description": "Learn how applications communicate with each other through REST APIs.",
            "topics": [
                "HTTP methods",
                "REST architecture",
                "Requests and responses",
                "Status codes",
                "JSON",
                "FastAPI"
            ],
            "resources": [
                {
                    "name": "MDN HTTP",
                    "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP"
                },
                {
                    "name": "FastAPI Tutorial",
                    "url": "https://fastapi.tiangolo.com/tutorial/"
                }
            ],
            "practice": "Build a REST API for a simple student management application."
        },

        "Database Management": {
            "priority": "High",
            "description": "Learn how applications store, organize, retrieve, and manage structured data.",
            "topics": [
                "Database concepts",
                "Tables",
                "Relationships",
                "SQL",
                "CRUD operations",
                "PostgreSQL"
            ],
            "resources": [
                {
                    "name": "PostgreSQL Tutorial",
                    "url": "https://www.postgresql.org/docs/current/tutorial.html"
                },
                {
                    "name": "SQLBolt",
                    "url": "https://sqlbolt.com/"
                }
            ],
            "practice": "Design and implement a database for a student career management system."
        },

        "Authentication": {
            "priority": "Medium",
            "description": "Learn how applications securely identify users and control access to protected resources.",
            "topics": [
                "Authentication",
                "Authorization",
                "Passwords",
                "Hashing",
                "JWT",
                "Sessions"
            ],
            "resources": [
                {
                    "name": "FastAPI Security",
                    "url": "https://fastapi.tiangolo.com/tutorial/security/"
                },
                {
                    "name": "OWASP Authentication",
                    "url": "https://owasp.org/www-community/controls/Authentication"
                }
            ],
            "practice": "Build a login and registration system with protected routes."
        },

        "Docker": {
            "priority": "Medium",
            "description": "Learn how to package applications into containers so they run consistently across environments.",
            "topics": [
                "Containers",
                "Images",
                "Dockerfile",
                "Volumes",
                "Networks",
                "Docker Compose"
            ],
            "resources": [
                {
                    "name": "Docker Get Started",
                    "url": "https://docs.docker.com/get-started/"
                },
                {
                    "name": "Docker Documentation",
                    "url": "https://docs.docker.com/"
                }
            ],
            "practice": "Containerize a small full-stack application using Docker Compose."
        },


        # ============================================================
        # BUSINESS / BBA
        # ============================================================

        "Excel": {
            "priority": "High",
            "description": "Develop practical Excel skills for business analysis, reporting, finance, and operations.",
            "topics": [
                "Formulas",
                "Functions",
                "VLOOKUP/XLOOKUP",
                "Pivot tables",
                "Charts",
                "Data cleaning"
            ],
            "resources": [
                {
                    "name": "Microsoft Excel Training",
                    "url": "https://support.microsoft.com/excel"
                },
                {
                    "name": "Excel Easy",
                    "url": "https://www.excel-easy.com/"
                }
            ],
            "practice": "Create a business sales dashboard using Excel formulas, pivot tables, and charts."
        },

        "Power BI": {
            "priority": "High",
            "description": "Learn business intelligence and transform raw business data into useful dashboards.",
            "topics": [
                "Power Query",
                "Data modeling",
                "DAX",
                "Visualizations",
                "Dashboards",
                "Reports"
            ],
            "resources": [
                {
                    "name": "Microsoft Learn Power BI",
                    "url": "https://learn.microsoft.com/power-bi/"
                },
                {
                    "name": "Power BI Guided Learning",
                    "url": "https://learn.microsoft.com/power-bi/guided-learning/"
                }
            ],
            "practice": "Create an interactive sales and business performance dashboard."
        },

        "Data Analysis": {
            "priority": "High",
            "description": "Learn how to turn raw business data into insights that support better decisions.",
            "topics": [
                "Data cleaning",
                "Descriptive analysis",
                "Trend analysis",
                "KPIs",
                "Business insights",
                "Reporting"
            ],
            "resources": [
                {
                    "name": "Google Data Analytics",
                    "url": "https://www.coursera.org/professional-certificates/google-data-analytics"
                },
                {
                    "name": "Kaggle Learn",
                    "url": "https://www.kaggle.com/learn"
                }
            ],
            "practice": "Analyze a company's sales dataset and prepare a management insights report."
        },

        "Business Communication": {
            "priority": "High",
            "description": "Develop professional communication skills for meetings, presentations, emails, and workplace collaboration.",
            "topics": [
                "Professional emails",
                "Presentations",
                "Meetings",
                "Business writing",
                "Active listening",
                "Professional etiquette"
            ],
            "resources": [
                {
                    "name": "Coursera Communication Courses",
                    "url": "https://www.coursera.org/courses?query=business%20communication"
                },
                {
                    "name": "LinkedIn Learning",
                    "url": "https://www.linkedin.com/learning/topics/business-communication"
                }
            ],
            "practice": "Prepare and deliver a five-minute business presentation on a real company."
        },

        "Requirements Gathering": {
            "priority": "High",
            "description": "Learn how business analysts identify, document, and communicate stakeholder requirements.",
            "topics": [
                "Stakeholder analysis",
                "Interviews",
                "Requirements documentation",
                "User stories",
                "Use cases",
                "Process mapping"
            ],
            "resources": [
                {
                    "name": "IIBA",
                    "url": "https://www.iiba.org/"
                },
                {
                    "name": "Business Analysis Courses",
                    "url": "https://www.coursera.org/courses?query=business%20analysis"
                }
            ],
            "practice": "Choose a business problem and create a complete requirements document."
        },

        "Problem Solving": {
            "priority": "High",
            "description": "Develop structured thinking skills to analyze problems and create effective solutions.",
            "topics": [
                "Problem definition",
                "Root cause analysis",
                "5 Whys",
                "Decision making",
                "Critical thinking",
                "Solution evaluation"
            ],
            "resources": [
                {
                    "name": "Coursera Problem Solving",
                    "url": "https://www.coursera.org/courses?query=problem%20solving"
                },
                {
                    "name": "MindTools",
                    "url": "https://www.mindtools.com/"
                }
            ],
            "practice": "Analyze a real business problem and present three possible solutions with pros and cons."
        },


        # ============================================================
        # DIGITAL MARKETING
        # ============================================================

        "SEO": {
            "priority": "High",
            "description": "Learn how websites improve their visibility and rankings in search engines.",
            "topics": [
                "Keywords",
                "On-page SEO",
                "Technical SEO",
                "Backlinks",
                "Search intent",
                "SEO analytics"
            ],
            "resources": [
                {
                    "name": "Google Search Central",
                    "url": "https://developers.google.com/search"
                },
                {
                    "name": "Ahrefs Academy",
                    "url": "https://ahrefs.com/academy"
                }
            ],
            "practice": "Optimize a small website for a selected keyword and track its performance."
        },

        "Social Media Marketing": {
            "priority": "High",
            "description": "Learn how businesses use social platforms to build audiences and promote products.",
            "topics": [
                "Content strategy",
                "Audience research",
                "Instagram marketing",
                "LinkedIn marketing",
                "Campaign planning",
                "Analytics"
            ],
            "resources": [
                {
                    "name": "Meta Blueprint",
                    "url": "https://www.facebook.com/business/learn"
                },
                {
                    "name": "HubSpot Academy",
                    "url": "https://academy.hubspot.com/"
                }
            ],
            "practice": "Create a 30-day social media campaign for a fictional brand."
        },

        "Content Marketing": {
            "priority": "High",
            "description": "Learn how valuable content can attract, educate, and convert an audience.",
            "topics": [
                "Content strategy",
                "Audience research",
                "Blog writing",
                "Content calendars",
                "Storytelling",
                "Analytics"
            ],
            "resources": [
                {
                    "name": "HubSpot Content Marketing",
                    "url": "https://academy.hubspot.com/courses/content-marketing"
                },
                {
                    "name": "Content Marketing Institute",
                    "url": "https://contentmarketinginstitute.com/"
                }
            ],
            "practice": "Create a one-month content calendar for a business."
        },

        "Google Analytics": {
            "priority": "Medium",
            "description": "Learn how to understand website traffic, user behavior, and digital performance.",
            "topics": [
                "Traffic sources",
                "Events",
                "Conversions",
                "Reports",
                "User behavior",
                "KPIs"
            ],
            "resources": [
                {
                    "name": "Google Analytics Academy",
                    "url": "https://analytics.google.com/analytics/academy/"
                },
                {
                    "name": "Google Analytics Help",
                    "url": "https://support.google.com/analytics/"
                }
            ],
            "practice": "Create a mock website analytics report identifying traffic trends and conversions."
        },

        "Email Marketing": {
            "priority": "Medium",
            "description": "Learn how businesses use email campaigns to communicate with customers and generate engagement.",
            "topics": [
                "Email campaigns",
                "Audience segmentation",
                "Subject lines",
                "Automation",
                "A/B testing",
                "Analytics"
            ],
            "resources": [
                {
                    "name": "HubSpot Email Marketing",
                    "url": "https://academy.hubspot.com/courses/email-marketing"
                },
                {
                    "name": "Mailchimp Resources",
                    "url": "https://mailchimp.com/resources/"
                }
            ],
            "practice": "Design a five-email campaign for launching a fictional product."
        },

        "Copywriting": {
            "priority": "High",
            "description": "Learn to write persuasive and engaging content for marketing, advertising, and digital platforms.",
            "topics": [
                "Headlines",
                "Persuasive writing",
                "Call-to-action",
                "Brand voice",
                "Ad copy",
                "Storytelling"
            ],
            "resources": [
                {
                    "name": "HubSpot Academy",
                    "url": "https://academy.hubspot.com/"
                },
                {
                    "name": "Copyblogger",
                    "url": "https://copyblogger.com/"
                }
            ],
            "practice": "Write landing-page copy and three advertisements for a fictional product."
        },


        # ============================================================
        # SOFT SKILLS
        # ============================================================

        "Communication": {
            "priority": "High",
            "description": "Develop the ability to communicate ideas clearly and effectively in academic and professional environments.",
            "topics": [
                "Verbal communication",
                "Written communication",
                "Active listening",
                "Presentation skills",
                "Professional communication"
            ],
            "resources": [
                {
                    "name": "Coursera Communication Courses",
                    "url": "https://www.coursera.org/courses?query=communication%20skills"
                },
                {
                    "name": "TED Talks",
                    "url": "https://www.ted.com/talks"
                }
            ],
            "practice": "Record yourself giving a five-minute presentation and review your communication."
        },


        # ============================================================
        # PHARMA / HEALTHCARE
        # ============================================================

        "Clinical Research": {
            "priority": "High",
            "description": "Learn the fundamentals of conducting and managing research involving human participants and medical treatments.",
            "topics": [
                "Clinical research basics",
                "Study design",
                "Research protocols",
                "Data collection",
                "Research ethics",
                "Clinical research workflow"
            ],
            "resources": [
                {
                    "name": "NIH Clinical Research",
                    "url": "https://www.nih.gov/"
                },
                {
                    "name": "Coursera Clinical Research",
                    "url": "https://www.coursera.org/courses?query=clinical%20research"
                }
            ],
            "practice": "Create a mock clinical research protocol for a simple observational study."
        },

        "Clinical Trials": {
            "priority": "High",
            "description": "Understand how clinical trials are designed, conducted, monitored, and reported.",
            "topics": [
                "Trial phases",
                "Study protocols",
                "Participants",
                "Randomization",
                "Data collection",
                "Trial reporting"
            ],
            "resources": [
                {
                    "name": "ClinicalTrials.gov",
                    "url": "https://clinicaltrials.gov/"
                },
                {
                    "name": "WHO Clinical Trials",
                    "url": "https://www.who.int/"
                }
            ],
            "practice": "Study an existing clinical trial and summarize its objectives, design, and outcomes."
        },

        "Good Clinical Practice": {
            "priority": "High",
            "description": "Understand international ethical and scientific standards for conducting clinical research.",
            "topics": [
                "ICH-GCP",
                "Ethics",
                "Informed consent",
                "Investigator responsibilities",
                "Participant safety",
                "Documentation"
            ],
            "resources": [
                {
                    "name": "ICH Guidelines",
                    "url": "https://www.ich.org/page/efficacy-guidelines"
                },
                {
                    "name": "FDA Good Clinical Practice",
                    "url": "https://www.fda.gov/"
                }
            ],
            "practice": "Create a checklist of key GCP responsibilities for a clinical research team."
        },

        "Medical Terminology": {
            "priority": "High",
            "description": "Build familiarity with the vocabulary used across healthcare, medicine, and clinical environments.",
            "topics": [
                "Medical prefixes",
                "Medical suffixes",
                "Body systems",
                "Diseases",
                "Procedures",
                "Clinical abbreviations"
            ],
            "resources": [
                {
                    "name": "MedlinePlus",
                    "url": "https://medlineplus.gov/"
                },
                {
                    "name": "OpenStax Anatomy",
                    "url": "https://openstax.org/details/books/anatomy-and-physiology"
                }
            ],
            "practice": "Create a personal medical terminology glossary organized by body system."
        },

        "Data Management": {
            "priority": "High",
            "description": "Learn how healthcare and research data can be collected, organized, maintained, and protected.",
            "topics": [
                "Data collection",
                "Data quality",
                "Data organization",
                "Data privacy",
                "Data validation",
                "Data reporting"
            ],
            "resources": [
                {
                    "name": "NIH Data Management",
                    "url": "https://sharing.nih.gov/data-management-and-sharing-policy"
                },
                {
                    "name": "Coursera Data Management",
                    "url": "https://www.coursera.org/courses?query=data%20management"
                }
            ],
            "practice": "Design a structured dataset for managing clinical research participants."
        },

        "Regulatory Documentation": {
            "priority": "High",
            "description": "Learn how documentation supports regulatory compliance and quality in healthcare and clinical research.",
            "topics": [
                "Documentation standards",
                "Regulatory requirements",
                "Audit trails",
                "Record keeping",
                "Compliance",
                "Quality control"
            ],
            "resources": [
                {
                    "name": "FDA Guidance",
                    "url": "https://www.fda.gov/regulatory-information"
                },
                {
                    "name": "ICH Guidelines",
                    "url": "https://www.ich.org/page/efficacy-guidelines"
                }
            ],
            "practice": "Create a sample regulatory document checklist for a clinical study."
        },

        "Pharmacology": {
            "priority": "High",
            "description": "Build a foundation in how drugs work, their effects, mechanisms, and interactions.",
            "topics": [
                "Drug classes",
                "Mechanisms of action",
                "Pharmacokinetics",
                "Pharmacodynamics",
                "Drug interactions",
                "Adverse effects"
            ],
            "resources": [
                {
                    "name": "NCBI Bookshelf",
                    "url": "https://www.ncbi.nlm.nih.gov/books/"
                },
                {
                    "name": "Khan Academy Pharmacology",
                    "url": "https://www.khanacademy.org/science/health-and-medicine"
                }
            ],
            "practice": "Create a study chart comparing five drug classes, their mechanisms, uses, and major adverse effects."
        }
    }


    # ============================================================
    # GENERATE RECOMMENDATIONS
    # ============================================================

    for skill in missing_skills:

        if skill in learning_data:

            recommendation = {
                "skill": skill,
                "priority": learning_data[skill]["priority"],
                "description": learning_data[skill]["description"],
                "topics": learning_data[skill]["topics"],
                "resources": learning_data[skill]["resources"],
                "practice": learning_data[skill]["practice"]
            }

            recommendations.append(recommendation)


    return recommendations