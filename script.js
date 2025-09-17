function generateQRCode() {
  const qrText = document.getElementById("qrText").value.trim();
  const qrResult = document.getElementById("qrResult");
  const actionButtons = document.getElementById("actionButtons");
  const suggestions = document.getElementById("suggestions");

  // Clear previous content
  qrResult.innerHTML = "";
  actionButtons.style.display = "none";

  if (qrText === "") {
    qrResult.innerHTML = "<p style='color: red;'>Please enter text or URL</p>";
    return;
  }

  // Save input in localStorage for future suggestions
  let history = JSON.parse(localStorage.getItem("qrHistory")) || [];
  if (!history.includes(qrText)) {
    history.push(qrText);
    localStorage.setItem("qrHistory", JSON.stringify(history));
  }

  // Update suggestions dropdown
  suggestions.innerHTML = "";
  history.forEach(item => {
    const option = document.createElement("div");
    option.textContent = item;
    option.onclick = () => {
      document.getElementById("qrText").value = item;
      suggestions.style.display = "none";
    };
    suggestions.appendChild(option);
  });

  // Step 1: Show loading spinner
  const loader = document.createElement("div");
  loader.className = "loader";
  qrResult.appendChild(loader);

  // Step 2: Prepare QR image
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrText)}&size=200x200`;
  const qrImage = new Image();
  qrImage.id = "qrImage";
  qrImage.alt = "QR Code";
  qrImage.src = qrUrl;
  qrImage.style.cursor = "pointer";

  // Step 3: Wait for image to load
  qrImage.onload = function () {
    setTimeout(() => {
      qrResult.innerHTML = "";
      qrResult.appendChild(qrImage);
      actionButtons.style.display = "flex";
    }, 200); // small delay for loader
  };
}

// ✅ Download QR Code (forces save to Downloads folder)
async function downloadQRCode() {
  const qrImage = document.getElementById("qrImage");
  if (!qrImage) {
    alert("Please generate a QR code first!");
    return;
  }

  try {
    const response = await fetch(qrImage.src);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();

    // cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Download failed:", err);
    alert("Failed to download QR Code.");
  }
}

// ✅ Clear QR Code
function clearQRCode() {
  document.getElementById("qrText").value = "";
  document.getElementById("qrResult").innerHTML = "";
  document.getElementById("actionButtons").style.display = "none";
}

// ✅ Dark/Light Mode Toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  // Default: dark mode on
  body.classList.add("dark-mode");

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
    } else {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
    }
  });
});
