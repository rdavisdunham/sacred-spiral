// src/components/templates/DefaultTemplate.js
import React from 'react';
import '../../styles/templates/DefaultTemplate.css';

const DefaultTemplate = ({ article }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to render individual text elements
  const renderTextElement = (child, childIndex) => {
    if (child.type !== 'text') return null;

    // Create a wrapper to apply multiple text modifications
    let content = child.text;

    // Apply text modifications
    if (child.bold) {
      content = <strong key={childIndex}>{content}</strong>;
    }
    if (child.italic) {
      content = <em key={childIndex}>{content}</em>;
    }
    if (child.underline) {
      content = <u key={childIndex}>{content}</u>;
    }
    if (child.strikethrough) {
      content = <del key={childIndex}>{content}</del>;
    }
    if (child.code) {
      content = <code key={childIndex}>{content}</code>;
    }

    return content;
  };

  // Function to render content blocks
  const renderContent = (content) => {
    if (!content || !Array.isArray(content)) {
      return <p>No content available for this article.</p>;
    }

    return content.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index} className="article-paragraph">
              {block.children.map((child, childIndex) => {
                // Handle links separately
                if (child.type === 'link') {
                  return (
                    <a 
                      key={childIndex} 
                      href={child.url}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="article-link"
                    >
                      {child.children.map((linkChild, linkChildIndex) => 
                        renderTextElement(linkChild, `${childIndex}-${linkChildIndex}`)
                      )}
                    </a>
                  );
                }
                return renderTextElement(child, childIndex);
              })}
            </p>
          );

        case 'list':
          const ListComponent = block.format === 'ordered' ? 'ol' : 'ul';
          return (
            <ListComponent key={index} className={`article-list ${block.format === 'ordered' ? 'ordered' : 'unordered'}`}>
              {block.children.map((listItem, listItemIndex) => (
                <li key={listItemIndex} className="article-list-item">
                  {listItem.children.map((child, childIndex) => 
                    renderTextElement(child, childIndex)
                  )}
                </li>
              ))}
            </ListComponent>
          );

        case 'heading':
          const HeadingTag = `h${block.level}`;
          return (
            <HeadingTag key={index} className={`article-heading-${block.level}`}>
              {block.children.map((child, childIndex) => 
                renderTextElement(child, childIndex)
              )}
            </HeadingTag>
          );

        case 'blockquote':
          return (
            <blockquote key={index} className="article-blockquote">
              {block.children.map((child, childIndex) => {
                if (child.type === 'paragraph') {
                  return (
                    <p key={childIndex}>
                      {child.children.map((textChild, textChildIndex) => 
                        renderTextElement(textChild, textChildIndex)
                      )}
                    </p>
                  );
                }
                return null;
              })}
            </blockquote>
          );

        default:
          console.log("Unhandled block type:", block.type);
          return null;
      }
    });
  };

  return (
    <div className="defaulttemplate">
      {/* Article header section */}
      <header className="article-header">
        {article.genre && <span className="article-genre">{article.genre}</span>}
        <h1>{article.title}</h1>
        
        <div className="article-metadata">
          <p className="article-author">By {article.author || 'Sacred Spiral Studios'}</p>
          <p className="article-date">{formatDate(article.publishedAt)}</p>
        </div>
      </header>
      
      {/* Featured image */}
      {article.image && article.image.url && (
        <figure className="article-featured-image">
          <img 
            src={`${process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337'}${article.image.url}`} 
            alt={article.image.alternativeText || article.title} 
          />
          {article.image.caption && <figcaption>{article.image.caption}</figcaption>}
        </figure>
      )}

      {/* Article content */}
      <div className="article-content">
        {renderContent(article.content)}
      </div>
    </div>
  );
};

export default DefaultTemplate;