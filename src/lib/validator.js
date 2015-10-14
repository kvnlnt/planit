/**
 * Main validator function, see usage
 */
function Validator(component) {

    /**
     * params
     */
    var fields = {};
    var component = component;

    /**
     * add fields
     */
    function add(field) {
        fields[field.name] = field;
        return this;
    }

    /**
     * validate fields
     */
    function validate() {

        component.setState({
            hasValidated: true
        });
        var isValid = true;

        // loop fields
        for (var field in fields) {

            // reset fields
            fields[field].errors = [];
            fields[field].classes = '';

            // loop validations
            for (var validation in fields[field].validations) {
                var func = eval(fields[field].validations[validation].validation);
                var args = fields[field].validations[validation].args;
                var val = fields[field].val;
                args = args || [];
                args.unshift(val);
                var hasError = func.apply(this, args);

                // if has error, update field
                if (hasError) {
                    isValid = false;
                    var error = hasError.replace('%field%', fields[field].friendlyName)
                    fields[field].errors.push(error);
                    fields[field].classes = 'error';
                }

                // update state
                var state = {};
                state[field] = fields[field];
                component.setState(state);
            }

        }

        return isValid;
    }

    /**
     * export funcs
     */
    return {
        add: add,
        validate: validate
    }
};

// Validations
// message must be last
function email(val, message) {
    var re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    var isValid = re.test(val);
    var message = message || '%field% must be a valid email address';
    return isValid ? null : message;
}

function password(val, message) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{3,}$/;
    var isValid = re.test(val);
    var message = message || '%field% needs at least one upper and lower case letter and a number';
    return isValid ? null : message;
}

function minLength(val, len, message) {
    var isValid = val.length > len;
    var message = message || '%field% needs to be at least ' + len + ' characters long';
    return isValid ? null : message;
}

function maxLength(val, len, message) {
    var isValid = val.length < len;
    var message = message || '%field% needs to be less than ' + len + ' characters long';
    return isValid ? null : message;
}

function equals(val, compareVal, message) {
    var isValid = val === compareVal;
    var message = message || '%field% was incorrect';
    return isValid ? null : message;
}

function required(val, message) {
    var isValid = val !== null && val !== void 0 && val !== "";
    var message = message || '%field% is required';
    return isValid ? null : message;
}

module.exports = {
    Validator: Validator,
    email: email,
    password: password,
    minLength: minLength,
    maxLength: maxLength,
    equals: equals,
    required: required
};

// EXAMPLE USAGE
// var payload = {
//     username: 'Kevin1',
//     password: 'lint',
//     misc: '1235'
// };

// var validator = new Validator();
// var validate = validator
// .add(payload.username, 'username', 'Username', mixedCaseAlphaNumeric)
// .add(payload.username, 'username', 'Username', minLength, [8])
// .add(payload.password, 'password', 'Password', mixedCaseAlphaNumeric)
// .add(payload.password, 'password', 'Password', minLength, [8])
// .validate();

// console.log(validate);