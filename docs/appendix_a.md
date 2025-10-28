# Appendix A - Knowledgebase Concepts

<ul id="json-list"></ul>

<script>
fetch('https://m3.shore.mbari.org/kb/v1/concept')
  .then(response => response.json())
  .then(items => {
    const list = document.getElementById('json-list');
    items.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  })
  .catch(err => {
    console.error('Failed to fetch data:', err);
    document.getElementById('json-list').innerHTML =
      '<li><em>Failed to load data</em></li>';
  });
</script>