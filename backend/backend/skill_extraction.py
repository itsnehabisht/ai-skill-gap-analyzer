import json
import re
from pathlib import Path


def find_skills_file():
    """
    Search parent folders until data/skills.json is found.
    This makes the project independent of where FastAPI is started from.
    """

    current_path = Path(__file__).resolve()

    for folder in current_path.parents:

        possible_path = folder / "data" / "skills.json"

        if possible_path.exists():
            return possible_path

    raise FileNotFoundError(
        "Could not find data/skills.json"
    )


def load_skills():

    skills_path = find_skills_file()

    with open(skills_path, "r", encoding="utf-8") as file:
        return json.load(file)


def normalize_text(text):

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9+#.\- ]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def extract_skills(resume_text):

    skills_data = load_skills()

    normalized_resume = normalize_text(resume_text)

    extracted_skills = []

    for skill in skills_data.keys():

        normalized_skill = normalize_text(skill)

        pattern = (
            r"(?<![a-z0-9])"
            + re.escape(normalized_skill)
            + r"(?![a-z0-9])"
        )

        if re.search(pattern, normalized_resume):

            extracted_skills.append(skill)

    return extracted_skills