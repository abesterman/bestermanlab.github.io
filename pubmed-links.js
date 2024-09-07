async function fetchPubMedLink(title, authors, journal) {
    const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
    const query = `${encodeURIComponent(title)} ${encodeURIComponent(authors)} ${encodeURIComponent(journal)}`;
    const url = `${baseUrl}?db=pubmed&term=${query}&retmode=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.esearchresult.idlist && data.esearchresult.idlist.length > 0) {
            const pmid = data.esearchresult.idlist[0];
            return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
        }
    } catch (error) {
        console.error('Error fetching PubMed link:', error);
    }
    return null;
}

async function updatePublicationLinks() {
    const publications = document.querySelectorAll('.publication-list li');
    for (const pub of publications) {
        const linkElement = pub.querySelector('a');
        if (linkElement && linkElement.getAttribute('href') === '#') {
            const title = linkElement.textContent;
            const authorJournalText = pub.textContent.split(title)[1];
            const [authors, journalInfo] = authorJournalText.split('.');
            const journal = journalInfo.split(',')[0].trim();
            
            const pubmedLink = await fetchPubMedLink(title, authors, journal);
            if (pubmedLink) {
                linkElement.href = pubmedLink;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', updatePublicationLinks);
