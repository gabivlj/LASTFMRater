import React from 'react';
import { StyleIt, SetThemeVariables } from '../../styles/StyleIt';

function Test({ styles }) {
  return (
    <div>
      <button
        style={styles.button}
        onClick={() =>
          SetThemeVariables(theme => ({ ...theme, primaryColor: 'pink' }))
        }
        type="button"
      >
        Hey
      </button>
      <button
        style={styles.button}
        onClick={() =>
          SetThemeVariables(theme => ({ ...theme, primaryColor: 'blue' }))
        }
        type="button"
      >
        Hey
      </button>
      <button
        style={styles.button}
        onClick={() =>
          SetThemeVariables(theme => ({ ...theme, primaryColor: 'red' }))
        }
        type="button"
      >
        Hey
      </button>
      <button
        style={styles.button}
        onClick={() =>
          SetThemeVariables(theme => ({ ...theme, primaryColor: 'black' }))
        }
        type="button"
      >
        Hey
      </button>
    </div>
  );
}

export default StyleIt(Test, ['button']);
