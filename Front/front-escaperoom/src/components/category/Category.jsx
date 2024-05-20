import React from "react";
const Category = (props) => {
  return (
    <div className="category">
      <details>
        <summary>
          <h2>{props.title}</h2>
          <span className="category-icon">👇🏿</span>
        </summary>
        {props.children}
      </details>
    </div>
  );
};
export default Category;
