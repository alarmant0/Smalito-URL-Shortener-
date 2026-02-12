async function loadLinks() {
  const response = await fetch("/13085629-bda9-4d72-af37-12500d368f19/get");
  const data = await response.json();

  document.getElementById("totalLinks").textContent = data.total_links;
  document.getElementById("totalClicks").textContent = data.total_clicks;
  document.getElementById("todayClicks").textContent = data.today_clicks;

  const table = document.getElementById("linksTable");
  table.innerHTML = "";

  data.links.forEach(link => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="selectLink" value="${link.code}"></td>
      <td>${link.smalito_url}</td>
      <td>${link.original_url}</td>
      <td>${link.clicks}</td>
      <td>${new Date(link.created_at).toLocaleDateString()}</td>
      <td class="actions">
        <button class="copy" onclick="copyLink('${link.short_url}')">Copy</button>
        <button class="delete" onclick="deleteLink('${link.code}')">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });

  setupSelectAll();
}

function copyLink(url) {
  navigator.clipboard.writeText(url);
}

async function deleteLink(code) {
  if (!confirm("Delete this link?")) return;
  await fetch(`/13085629-bda9-4d72-af37-12500d368f19/delete/${code}`, { method: "DELETE" });
  loadLinks();
}

// Bulk delete selected links
async function deleteSelected() {
  const checkboxes = document.querySelectorAll(".selectLink:checked");
  if (checkboxes.length === 0) {
    alert("No links selected.");
    return;
  }

  if (!confirm(`Delete ${checkboxes.length} selected link(s)?`)) return;

  for (const cb of checkboxes) {
    await fetch(`/13085629-bda9-4d72-af37-12500d368f19/delete/${cb.value}`, { method: "DELETE" });
  }
  loadLinks();
}

// Select / Deselect all
function setupSelectAll() {
  const selectAll = document.getElementById("selectAll");
  const checkboxes = document.querySelectorAll(".selectLink");

  selectAll.checked = false;

  selectAll.addEventListener("change", () => {
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
  });
}

// Attach bulk delete button
document.getElementById("deleteSelectedBtn").addEventListener("click", deleteSelected);

// Initial load
loadLinks();
