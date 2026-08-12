import urllib.request
import xml.etree.ElementTree as ET
import json
import re

SUBSTACK_RSS = "https://hooshaai.substack.com/feed"

def clean_html(raw_html):
    clean = re.sub(r'<[^>]+>', '', raw_html)
    return clean.strip()

def count_words(text):
    return len(text.split())

def calculate_read_time(word_count):
    minutes = max(1, round(word_count / 250))
    return f"{minutes} min read"

def fetch_articles():
    print(f"Fetching RSS feed from {SUBSTACK_RSS}...")
    req = urllib.request.Request(
        SUBSTACK_RSS, 
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
        
        root = ET.fromstring(xml_data)
        channel = root.find('channel')
        
        articles = []
        for item in channel.findall('item'):
            title = item.find('title').text if item.find('title') is not None else ""
            link = item.find('link').text if item.find('link') is not None else ""
            pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ""
            
            # Content
            content_elem = item.find('{http://purl.org/rss/1.0/modules/content/}encoded')
            if content_elem is None:
                content_elem = item.find('description')
            
            content_html = content_elem.text if content_elem is not None else ""
            clean_text = clean_html(content_html)
            word_cnt = count_words(clean_text)
            read_time = calculate_read_time(word_cnt)
            
            articles.append({
                "title": title,
                "link": link,
                "pubDate": pub_date,
                "wordCount": f"{word_cnt:,} words",
                "readTime": read_time,
                "snippet": clean_text[:200] + "..." if len(clean_text) > 200 else clean_text
            })
            
        print(f"Successfully fetched {len(articles)} articles!")
        
        with open("articles.json", "w", encoding="utf-8") as f:
            json.dump(articles, f, indent=2)
            
        print("Saved to articles.json!")
        return articles
    except Exception as e:
        print(f"Error fetching RSS: {e}")
        return []

if __name__ == "__main__":
    fetch_articles()
