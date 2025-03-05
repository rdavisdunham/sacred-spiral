// src/components/templates/Template1.js
import React from 'react';

const DefaultTemplate = ({ article }) => {
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
    return content.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={index}>
              {block.children.map((child, childIndex) => {
                // Handle links separately
                if (child.type === 'link') {
                  return (
                    <a 
                      key={childIndex} 
                      href={child.url}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {child.children.map(renderTextElement)}
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
            <ListComponent key={index}>
              {block.children.map((listItem, listItemIndex) => (
                <li key={listItemIndex}>
                  {listItem.children.map((child, childIndex) => 
                    renderTextElement(child, childIndex)
                  )}
                </li>
              ))}
            </ListComponent>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="defaulttemplate">
      <h1>{article.title}</h1>
      <p>By {article.author}</p>
      
      {/* Render image if it exists */}
      {article.image && article.image.url && (
        <img 
          src={`${process.env.REACT_APP_STRAPI_URL}${article.image.url}`} 
          alt={article.image.alternativeText || article.title} 
        />
      )}

      <div className="article-content">
        {renderContent(article.content)}
      </div>
    </div>
  );
};

export default DefaultTemplate;