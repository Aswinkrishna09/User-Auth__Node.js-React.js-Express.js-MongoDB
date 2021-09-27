import React, { Fragment } from "react";
import { useSelector } from "react-redux";
const Alert = () => {
  const alertReducer = useSelector((state) => state.alertReducer);
  const data = alertReducer.map(alet=>{
      return (
          
          <div key={alet.id} className={`alert alert-${alet.alertType}`}>
              {alet.msg}
          </div>
        
      )
  })
  console.log(data)
  return (
    <Fragment>
      {/* {alertReducer!==null */}
      {data?
      <div>{data}</div>
      : (
       ""
      )}
    </Fragment>
  );
};

export default Alert;
