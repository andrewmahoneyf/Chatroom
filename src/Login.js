import React from 'react';
import noUserPic from './img/no-user-pic.png';

class SignInForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      'email': undefined,
      'password': undefined,
    }; 
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;
    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }
  signIn(event) {
    event.preventDefault(); //don't submit
    this.props.signInCallback(this.state.email, this.state.password);
  }
  validate(value, validations) {
    var errors = {isValid: true, style:''};
    if(value !== undefined){ //check validations
      if(validations.required && value === ''){
        errors.required = true;
        errors.isValid = false;
      }
      if(validations.minLength && value.length < validations.minLength){
        errors.minLength = validations.minLength;
        errors.isValid = false;
      }
      if(validations.email){
        var valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
        if(!valid){
          errors.email = true;
          errors.isValid = false;
        }
      }
    }
    if(!errors.isValid){ //if found errors
      errors.style = 'has-error';
    }
    else if(value !== undefined){ //valid and has input
      //errors.style = 'has-success' //show success coloring
    }
    else { //valid and no input
      errors.isValid = false; //make false anyway
    }
    return errors; //return data object
  }
  render() {
    var emailErrors = this.validate(this.state.email, {required:true, email:true});
    var passwordErrors = this.validate(this.state.password, {required:true, minLength:6});
    var handleErrors = this.validate(this.state.handle, {required:true, minLength:3});
    var signInEnabled = (emailErrors.isValid && passwordErrors.isValid);
    return (
      <form role="form" className="sign-up-form">
        <ValidatedInput field="email" type="email" label="Email" changeCallback={this.handleChange} errors={emailErrors} />
        <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />
        <div className="form-group sign-up-buttons">
          <button className="btn btn-primary" disabled={!signInEnabled} onClick={(e) => this.signIn(e)}>Sign-in</button>
        </div>
      </form>
    );
  }
}
SignInForm.propTypes = {
  signInCallback: React.PropTypes.func.isRequired
};

class ValidatedInput extends React.Component {
  render() {
    return (
      <div className={"form-group "+this.props.errors.style}>
        <label htmlFor={this.props.field} className="control-label">{this.props.label}</label>
        <input id={this.props.field} type={this.props.type} name={this.props.field} className="form-control" onChange={this.props.changeCallback} />
        <ValidationErrors errors={this.props.errors} />
      </div>
    );
  }  
}

class ValidationErrors extends React.Component {
  render() {
    return (
      <div>
        {this.props.errors.required &&
          <p className="help-block">Required!</p>
        }
        {this.props.errors.email &&
          <p className="help-block">Not an email address!</p>
        }
        {this.props.errors.minLength &&
          <p className="help-block">Must be at least {this.props.errors.minLength} characters.</p>        
        }
      </div>
    );
  }
}

class SignInApp extends React.Component {
  signIn(email, password) {
    window.alert("Signing in:", email);
  }
  render() {
    return (
      <div className="container">
        <header>
          <h1>Sign In!</h1>
        </header>
        <SignInForm signInCallback={this.signIn} />
      </div>
    );
  }
}

export default SignInForm;