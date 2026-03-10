#!/usr/bin/env python3
"""
Convert all markdown posts to a JSON file for the static site.
"""

import os
import json
import re
from datetime import datetime

def parse_front_matter(content):
    """Parse YAML front matter from markdown content."""
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            front_matter = parts[1].strip()
            body = parts[2].strip()
            
            # Parse front matter
            metadata = {}
            for line in front_matter.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    metadata[key] = value
            
            return metadata, body
    return {}, content

def parse_markdown(md_content):
    """Simple markdown to HTML conversion."""
    # Remove YAML front matter
    _, body = parse_front_matter(md_content)
    
    # Remove the first h1 (title) and date since we'll display those separately
    body = re.sub(r'^# .+$', '', body, flags=re.MULTILINE)
    body = re.sub(r'\*\*Date:\*\* .+$', '', body, flags=re.MULTILINE)
    body = re.sub(r'^---+$', '', body, flags=re.MULTILINE)
    body = re.sub(r'\*Source:.*\*', '', body, flags=re.MULTILINE | re.DOTALL)
    
    # Convert markdown to HTML
    html = body
    
    # Headers
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    # Bold and italic
    html = re.sub(r'\*\*\*(.+?)\*\*\*', r'<strong><em>\1</em></strong>', html)
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    
    # Paragraphs - split by double newlines and wrap in <p>
    paragraphs = html.split('\n\n')
    new_paragraphs = []
    for p in paragraphs:
        p = p.strip()
        if p and not p.startswith('<h') and not p.startswith('<') and not p.startswith('>'):
            # Replace single newlines with <br> within paragraphs
            p = p.replace('\n', '<br>')
            new_paragraphs.append(f'<p>{p}</p>')
        else:
            new_paragraphs.append(p)
    html = '\n\n'.join(new_paragraphs)
    
    return html.strip()

def main():
    posts_dir = 'posts'
    output_file = 'public/posts.json'
    
    posts = []
    
    for filename in sorted(os.listdir(posts_dir)):
        if filename.endswith('.md'):
            filepath = os.path.join(posts_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            metadata, _ = parse_front_matter(content)
            html_content = parse_markdown(content)
            
            # Extract date from filename if not in metadata
            date_str = metadata.get('date', 'unknown')
            if date_str == 'unknown' or not date_str:
                # Try to extract from filename (YYYY-MM-DD-...)
                match = re.match(r'(\d{4}-\d{2}-\d{2})', filename)
                if match:
                    date_str = match.group(1)
            
            # Format date nicely
            formatted_date = date_str
            try:
                if date_str != 'unknown':
                    dt = datetime.strptime(date_str, '%Y-%m-%d')
                    formatted_date = dt.strftime('%B %d, %Y')
            except:
                pass
            
            post = {
                'title': metadata.get('title', 'Untitled'),
                'date': date_str,
                'formatted_date': formatted_date,
                'url': metadata.get('original_url', ''),
                'content': html_content,
                'slug': filename[:-3]  # Remove .md
            }
            posts.append(post)
    
    # Sort by date descending (newest first)
    posts.sort(key=lambda x: x['date'] if x['date'] != 'unknown' else '0000-00-00', reverse=True)
    
    # Save to JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    
    print(f"Converted {len(posts)} posts to {output_file}")

if __name__ == '__main__':
    main()
