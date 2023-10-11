import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui components

import { FormControl, TextField, createTheme } from "@mui/material";

import styles from "../assets/jss/customInputStyle";

const useStyles = createTheme(styles);

export default function CustomInput(props) {
  const classes = useStyles;
  const {
    formControlProps,
    labelText,
    id,
    // labelProps,
    inputProps,
    error,
    white,
    inputRootCustomClasses,
    success,
    handleChange,
    type,
  } = props;

  // const labelClasses = classNames({
  //   [" " + classes.labelRootError]: error,
  //   [" " + classes.labelRootSuccess]: success && !error,
  // });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true,
    [classes.whiteUnderline]: white,
  });
  const marginTop = classNames({
    [inputRootCustomClasses]: inputRootCustomClasses !== undefined,
  });
  const inputClasses = classNames({
    [classes.input]: true,
    [classes.whiteInput]: white,
  });
  var formControlClasses;
  if (formControlProps !== undefined) {
    formControlClasses = classNames(
      formControlProps.className,
      classes.formControl
    );
  } else {
    formControlClasses = classes.formControl;
  }
  return (
    <FormControl {...formControlProps} className={formControlClasses}>
      <TextField
        label={labelText}
        classes={{
          input: inputClasses,
          root: marginTop,
          disabled: classes.disabled,
          underline: underlineClasses,
        }}
        id={id}
        onChange={handleChange}
        {...inputProps}
        type={type}
      />
    </FormControl>
  );
}

CustomInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  inputRootCustomClasses: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
  white: PropTypes.bool,
};
