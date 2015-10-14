var Validator = require('../../lib/validator');

module.exports = {
    componentWillMount: function() {
        // register and set up field validators
        this.validator = new Validator.Validator(this);
        var that = this;
        for(var state in this.state){
            var isField = this.state[state].hasOwnProperty('validations');
            if(isField) {
                this.state[state].errors = [];
                this.state[state].classes = '';
                this.validator.add(this.state[state]);
            }
        }
    },
    handleChange: function(e) {
        e.preventDefault();
        var val = this.state[e.target.name];
        val.val = e.target.value;
        this.setState(val);
        if (this.state.hasValidated) this.validator.validate();
    },
    Input: function(field){
        return (
            <div>
                <input 
                    type="text"
                    placeholder={field.friendlyName}
                    name={field.name}
                    ref={field.name}
                    onChange={this.handleChange}
                    value={field.val}
                    className={field.classes} />
                <ul className="errorList">
                    {field.errors.map(function(error, i) {
                        return <li key={i}>{error}</li>;
                      })}
                </ul>
            </div>
        );
    }
};