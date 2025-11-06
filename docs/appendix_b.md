# Appendix B - Knowledgebase Associations

!!! note "Live Data"
This data is fetched _live_ from MBARI's VARS Knowledgebase

<input
type="text"
id="filter-box"
placeholder="Filter by linkName or linkValue (e.g., contains depth)..."
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

    // Multi-term filter + highlight logic
    filterBox.addEventListener('input', () => {
      const terms = filterBox.value
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean); // remove empty terms
      let visibleCount = 0;

      const rows = tbody.getElementsByTagName('tr');
      for (const row of rows) {
        const linkNameCell = row.querySelector('.linkName');
        const linkValueCell = row.querySelector('.linkValue');
        const linkName = linkNameCell?.textContent.toLowerCase() ?? '';
        const linkValue = linkValueCell?.textContent.toLowerCase() ?? '';
        const combined = `${linkName} ${linkValue}`;

        const match = terms.every(term => combined.includes(term));
        row.style.display = match ? '' : 'none';
        if (!match) continue;
        visibleCount++;

        // Restore original text (remove old highlights)
        linkNameCell.innerHTML = itemSafeHTML(linkNameCell.textContent);
        linkValueCell.innerHTML = itemSafeHTML(linkValueCell.textContent);

        // Apply highlights if any terms
        if (terms.length > 0) {
          for (const term of terms) {
            const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
            linkNameCell.innerHTML = linkNameCell.innerHTML.replace(
              regex,
              '<mark style="background:yellow;font-weight:bold;">$1</mark>'
            );
            linkValueCell.innerHTML = linkValueCell.innerHTML.replace(
              regex,
              '<mark style="background:yellow;font-weight:bold;">$1</mark>'
            );
          }
        }
      }

      countDiv.textContent = `Showing ${visibleCount} of ${total} associations`;
    });

    // Helper: safely encode text for HTML
    function itemSafeHTML(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  } catch (err) {
    console.error('Failed to fetch JSON:', err);
    document.querySelector('#json-table tbody').innerHTML =
      '<tr><td colspan="6"><em>Failed to load data</em></td></tr>';
  }
})();
</script>
