import { useEffect } from 'react';

/**
 * SEO component to dynamically manage page head elements (title, meta description,
 * OpenGraph, Twitter Cards, canonical links) without third-party dependencies.
 */
const SEO = ({
  title,
  description = 'Hoosha AI — Frontier research laboratory pioneering sub-quadratic attention, flow-matching, and verified cognitive scaling architectures.',
  keywords = 'Artificial Intelligence, AI Research, Continuous Flow Matching, GRPO, Transformers, Machine Learning, Deep Learning, Open Source LLM',
  image = 'https://hoosha.ai/og-image.png',
  url = 'https://hoosha.ai',
  type = 'website'
}) => {
  useEffect(() => {
    const siteTitle = 'HOOSHA AI — Frontier Artificial Intelligence & Open Research';
    const fullTitle = title ? `${title} | HOOSHA AI` : siteTitle;
    document.title = fullTitle;

    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow');
    setMetaTag('meta[name="author"]', 'name', 'author', 'HOOSHA AI Research Laboratory');

    // Open Graph / Facebook
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', window.location.href || url);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Hoosha AI');

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // Canonical link
    setLinkTag('canonical', window.location.href || url);

  }, [title, description, keywords, image, url, type]);

  return null;
};

export default SEO;
