async function fetchPubMedLink(publicationText) {
    // Check for PMID or PMCID in the publication text
    const pmidMatch = publicationText.match(/PMID:\s*(\d+)/);
    const pmcidMatch = publicationText.match(/PMCID:\s*(PMC\d+)/);

    if (pmidMatch) {
        return `https://pubmed.ncbi.nlm.nih.gov/${pmidMatch[1]}/`;
    } else if (pmcidMatch) {
        // For PMCID, we need to convert it to PMID
        const baseUrl = 'https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/';
        const url = `${baseUrl}?ids=${pmcidMatch[1]}&format=json`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.records && data.records[0] && data.records[0].pmid) {
                return `https://pubmed.ncbi.nlm.nih.gov/${data.records[0].pmid}/`;
            }
        } catch (error) {
            console.error('Error converting PMCID to PMID:', error);
        }
    }

    // If no PMID or PMCID found, return null
    return null;
}

async function updatePublicationLinks() {
    const publications = document.querySelectorAll('.publication-list li');
    for (const pub of publications) {
        const linkElement = pub.querySelector('a');
        if (linkElement && linkElement.getAttribute('href') === '#') {
            const publicationText = pub.textContent;
            const pubmedLink = await fetchPubMedLink(publicationText);
            if (pubmedLink) {
                linkElement.href = pubmedLink;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', updatePublicationLinks);
