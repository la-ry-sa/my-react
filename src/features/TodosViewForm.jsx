import React from 'react';
import { useState, useEffect } from 'react';

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  function preventRefresh(event) {
    event.preventDefault();
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label>Search todos</label>
        <input
          type="text"
          value={localQueryString}
          onChange={(event) => {
            setLocalQueryString(event.target.value);
          }}
        ></input>
        <button
          type="button"
          onClick={(event) => {
            setLocalQueryString('');
          }}
        >
          Clear
        </button>
      </div>
      <div>
        <label htmlFor="sortBy">Sort by</label>
        <select
          id="sortBy"
          value={sortField}
          onChange={(event) => {
            setSortField(event.target.value);
          }}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time Added</option>
        </select>
        <label htmlFor="direction">Direction</label>
        <select
          id="direction"
          value={sortDirection}
          onChange={(event) => {
            setSortDirection(event.target.value);
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
