import React from 'react';
import styled from 'styled-components';

function TextInputWithLabel({ elementId, labelText, onChange, ref, value }) {
  const StyledWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  return (
    <StyledWrapper>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </StyledWrapper>
  );
}

export default TextInputWithLabel;
