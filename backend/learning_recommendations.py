def generate_recommendations(missing_skills):
    recommendations = []

    learning_data = {
        "REST APIs": {
            "priority": "High",
            "description": "Learn how applications communicate with each other through APIs.",
            "topics": [
                "HTTP methods",
                "REST architecture",
                "API requests and responses",
                "FastAPI"
            ]
        },

        "Database Management": {
            "priority": "High",
            "description": "Learn how applications store, organize and retrieve data.",
            "topics": [
                "SQL",
                "Database design",
                "CRUD operations",
                "PostgreSQL"
            ]
        },

        "Authentication": {
            "priority": "Medium",
            "description": "Learn how applications securely identify and authorize users.",
            "topics": [
                "Authentication basics",
                "JWT",
                "Passwords and hashing",
                "Authorization"
            ]
        },

        "Docker": {
            "priority": "Medium",
            "description": "Learn how to package and run applications consistently.",
            "topics": [
                "Docker basics",
                "Images and containers",
                "Dockerfile",
                "Docker Compose"
            ]
        },

        "Machine Learning": {
            "priority": "High",
            "description": "Build a foundation in machine learning concepts and workflows.",
            "topics": [
                "Supervised learning",
                "Unsupervised learning",
                "Model training",
                "Model evaluation"
            ]
        },

        "Statistics": {
            "priority": "High",
            "description": "Develop the statistical foundation required for data analysis and machine learning.",
            "topics": [
                "Probability",
                "Mean and variance",
                "Distributions",
                "Hypothesis testing"
            ]
        },

        "Python": {
            "priority": "High",
            "description": "Strengthen your programming foundation with Python.",
            "topics": [
                "Python fundamentals",
                "Functions",
                "Object-oriented programming",
                "File handling"
            ]
        },

        "Git": {
            "priority": "Medium",
            "description": "Learn version control and collaborative software development.",
            "topics": [
                "Git basics",
                "Branches",
                "Commits",
                "GitHub workflows"
            ]
        }
    }

    for skill in missing_skills:

        if skill in learning_data:

            recommendation = {
                "skill": skill,
                "priority": learning_data[skill]["priority"],
                "description": learning_data[skill]["description"],
                "topics": learning_data[skill]["topics"]
            }

            recommendations.append(recommendation)

    return recommendations