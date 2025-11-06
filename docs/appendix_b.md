# Appendix B - Knowledgebase Associations

!!! note "Live Data"
    This data is fetched _live_ from MBARI's VARS Knowledgebase

<input
type="text"
id="filter-box"
placeholder="Filter by linkName or linkValue..."
style="width:100%;max-width:400px;padding:6px;margin-bottom:0.5em;"
/>
<div id="filter-count" style="margin-bottom:1em;font-size:0.9em;color:#555;"></div>

<table id="json-table" border="1" cellspacing="0" cellpadding="5">
  <thead>
    <tr>
      <th>concept</th>
      <th>linkName</th>
      <th>toConcept</th>
      <th>linkValue</th>
    </tr>
  </thead>
  <tbody>
    <tr><td colspan="6">Loading...</td></tr>
  </tbody>
</table>

<script>
(async () => {
  const url = 'https://m3.shore.mbari.org/kb/v1/linktemplates?limit=5000';

  try {
    const response = await fetch(url);
    const json = await response.json();
    const data = json.content || [];

    const tbody = document.querySelector('#json-table tbody');
    const filterBox = document.getElementById('filter-box');
    const countDiv = document.getElementById('filter-count');

    tbody.innerHTML = ''; // clear "Loading..." row

    // Populate table
    for (const item of data) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.concept ?? ''}</td>
        <td class="linkName">${item.linkName ?? ''}</td>
        <td>${item.toConcept ?? ''}</td>
        <td class="linkValue">${item.linkValue ?? ''}</td>
      `;
      tbody.appendChild(row);
    }

    const total = data.length;
    countDiv.textContent = `Showing ${total} of ${total} associations`;

    // Helper: escape regex special chars
    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Safely encode text
    function safeHTML(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    // Single-term filter + highlight
    filterBox.addEventListener('input', () => {
      const term = filterBox.value.trim().toLowerCase();
      const rows = tbody.getElementsByTagName('tr');
      let visibleCount = 0;

      for (const row of rows) {
        const linkNameCell = row.querySelector('.linkName');
        const linkValueCell = row.querySelector('.linkValue');
        const linkName = linkNameCell?.textContent.toLowerCase() ?? '';
        const linkValue = linkValueCell?.textContent.toLowerCase() ?? '';

        const match =
          term === '' ||
          linkName.includes(term) ||
          linkValue.includes(term);

        row.style.display = match ? '' : 'none';
        if (!match) continue;
        visibleCount++;

        // Reset text before re-highlighting
        linkNameCell.innerHTML = safeHTML(linkNameCell.textContent);
        linkValueCell.innerHTML = safeHTML(linkValueCell.textContent);

        if (term) {
          const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
          const highlight = '<mark style="background:gray;font-weight:bold;">$1</mark>';
          linkNameCell.innerHTML = linkNameCell.innerHTML.replace(regex, highlight);
          linkValueCell.innerHTML = linkValueCell.innerHTML.replace(regex, highlight);
        }
      }

      countDiv.textContent = `Showing ${visibleCount} of ${total} associations`;
    });
  } catch (err) {
    console.error('Failed to fetch JSON:', err);
    document.querySelector('#json-table tbody').innerHTML =
      '<tr><td colspan="6"><em>Failed to load data</em></td></tr>';
  }
})();
</script>
