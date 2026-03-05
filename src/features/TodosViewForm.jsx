import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

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

  const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;
  `;

  const StyledRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  `;

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledRow>
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
      </StyledRow>
      <StyledRow>
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
      </StyledRow>
    </StyledForm>
  );
}

export default TodosViewForm;
