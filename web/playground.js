async function loadSVG() {
  const response = await fetch("https://tommycs127.github.io/orbiticon/orbiticon.svg");
  const svgText = await response.text();
  
  // Insert SVG into the page
  const container = document.getElementById("orbiticon-result");
  container.innerHTML = svgText;
  
  // Extract and execute <script> inside the SVG
  const scripts = container.querySelectorAll("script");
  scripts.forEach(oldScript => {
    const newScript = document.createElement("script");
    // Copy the script content
    newScript.textContent = oldScript.textContent;
    // Append to execute it
    document.body.appendChild(newScript); 
  });
}

function savePlainSVG() {
  const svg =
    document.getElementById("orbiticon-result").querySelector("svg");
  if (!svg) {
    return;
  }

  // Clone the SVG to avoid modifying the original
  const clone = svg.cloneNode(true);

  // Remove all `data-*` attributes
  [...clone.attributes].forEach(
    (attr) => {
      if (attr.name.startsWith("data-")) {
        clone.removeAttribute(attr.name);
      }
    }
  );

  // Remove scripts if any exist
  clone.querySelectorAll("script").forEach(script => script.remove());

  // Serialize the SVG
  const svgString = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  // Create download link
  const a = document.createElement("a");
  const seed = document.getElementById("orbiticon-seed");
  a.href = url;
  a.download = `orbiticon-${seed.textContent}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Cleanup
  URL.revokeObjectURL(url);
}

function showSeed() {
  const seedInput = document.getElementById("data-seed");
  document.getElementById("orbiticon-seed").textContent =
    (seedInput.value || seedInput.placeholder);
}

function registerEvent(element, event) {
  element.addEventListener(event, function() {
    const container = document.getElementById("orbiticon-container");
    const svgs = container.querySelectorAll("svg");
    svgs.forEach((svg) => {
      if (["text", "number"].includes(element.type)) {
        svg.setAttribute(element.id, element.value || element.placeholder);
      }
      else if (["checkbox"].includes(element.type)) {
        svg.setAttribute(element.id, element.checked);
      }
    });
    showSeed();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadSVG();
  
  document.getElementById("control").querySelectorAll("fieldset").forEach(
    (fieldset) => {
      fieldset.querySelectorAll("input").forEach(
        (element) => {
          registerEvent(element, "input");
        }
      );
    }
  );
  
  document.getElementById("save-as-svg")
  .addEventListener("click", function() {
    savePlainSVG();
  });
  
  showSeed();
});
