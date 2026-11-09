const API_URL = "http://127.0.0.1:8000";

// Upload a file to the API
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");

    if (!fileInput || !fileInput.files.length) {
        alert("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Upload failed");
        }

        alert(result.message || "File uploaded successfully!");
        fileInput.value = "";
        viewFiles();
    } catch (error) {
        console.error("Upload error:", error);
        alert("Could not upload file. Check that the API is running.");
    }
}

// Get and display uploaded files
async function viewFiles() {
    const fileList = document.getElementById("fileList");

    try {
        const response = await fetch(`${API_URL}/files`);

        if (!response.ok) {
            throw new Error("Could not retrieve files");
        }

        const files = await response.json();
        fileList.innerHTML = "";

        files.forEach(file => {
            const item = document.createElement("li");
            item.textContent = file.filename;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deleteFile(file.filename);

            item.appendChild(deleteButton);
            fileList.appendChild(item);
        });
    } catch (error) {
        console.error("View error:", error);
        fileList.textContent = "Unable to load files. Check the API.";
    }
}

// Delete a file through the API
async function deleteFile(filename) {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/files/${encodeURIComponent(filename)}`,
            { method: "DELETE" }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Delete failed");
        }

        alert(result.message || "File deleted successfully!");
        viewFiles();
    } catch (error) {
        console.error("Delete error:", error);
        alert("Could not delete file.");
    }
}

// Load files when the page opens
document.addEventListener("DOMContentLoaded", viewFiles);