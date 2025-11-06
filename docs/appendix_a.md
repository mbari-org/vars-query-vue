# Appendix A - Knowledgebase Concepts

!!! note "Live Data"
    This data is fetched _live_ from MBARI's VARS Knowledgebase

<input
type="text"
id="filter-box"
placeholder="Filter concepts..."
style="width:100%;max-width:400px;padding:6px;margin-bottom:0.5em;"
/>
<div id="filter-count" style="margin-bottom:1em;font-size:0.9em;color:#555;"></div>

<ul id="json-list"></ul>

<script>
fetch('https://m3.shore.mbari.org/kb/v1/concept')
  .then(response => response.json())
  .then(items => {
    const list = document.getElementById('json-list');
    const filterBox = document.getElementById('filter-box');
    const countDiv = document.getElementById('filter-count');

    // Render list items
    items.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });

    const total = items.length;
    countDiv.textContent = `Showing ${total} of ${total} concepts`;

    // Filter logic
    filterBox.addEventListener('input', () => {
      const query = filterBox.value.toLowerCase();
      let visibleCount = 0;

      const lis = list.getElementsByTagName('li');
      for (const li of lis) {
        const match = li.textContent.toLowerCase().includes(query);
        li.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      }

      countDiv.textContent = `Showing ${visibleCount} of ${total} concepts`;
    });
  })
  .catch(err => {
    console.error('Failed to fetch data:', err);
    document.getElementById('json-list').innerHTML =
      '<li><em>Failed to load data</em></li>';
  });
</script>