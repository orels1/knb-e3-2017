/**
 * Created by orel- on 24/May/17.
 */
import React from 'react';
import Home from '../Home';

const App = (props) => {
  return (
    <div>
      <Home data={props.data} />
    </div>
  );
};

export default App;