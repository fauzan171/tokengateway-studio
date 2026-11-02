"""Run from repository root: python3 artifacts/brand/check-vector.py."""
from hashlib import sha256
from pathlib import Path
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[2]
reference = root / "briefs/assets/tokengateway-logo-reference.jpeg"
assert sha256(reference.read_bytes()).hexdigest() == "87360b16fab6a535cf24830ebaa0ada6bd65ff290696099483bd0a9c570e4ed6"
svg = ET.parse(root / "public/brand/tokengateway-mark.svg").getroot()
assert svg.attrib["viewBox"] == "0 0 904 620"
allowed = {"svg", "title", "g", "path", "circle"}
colors = set()
for element in svg.iter():
    assert element.tag.removeprefix("{http://www.w3.org/2000/svg}") in allowed
    assert not any(key.rsplit("}", 1)[-1].startswith("on") or "href" in key for key in element.attrib)
    for key in ("fill", "stroke"):
        if key in element.attrib and element.attrib[key] != "none":
            colors.add(element.attrib[key])
assert colors == {"#0066FF", "#16DDE2", "#293744"}
assert len(svg.findall(".//{http://www.w3.org/2000/svg}circle")) == 9
assert {"hexagon-fields", "circuit-connections", "circuit-nodes", "bracket"} <= {element.get("id") for element in svg.iter()}
print("PASS: reference hash, shape-only SVG, palette, groups, nine original nodes; owner approval still required.")
