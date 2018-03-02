import React from 'react';
import Select from 'react-select';
import SignInDetails from './SignInDetails';
import Respondent from '../Respondent';

function toSelectOptions(items) {
    return items.map(item => { return { value: item.identifier, label: item.label } }).sort(item => item.label);
}

export default class RespondentOptionsComponent extends React.Component {
    constructor(props) {
        super(props);

        const { authenticationStatus, respondent, respondentOptions } = props;
        const { departments, roles } = respondentOptions;

        Object.assign(this, { authenticationStatus, departments, roles });

        this.state = { respondent };
    }

    chageRespondent(props) {
        const respondent = this.state.respondent.change(props);
        this.setState({ respondent });
        this.props.onRespondentChanged(respondent);
    }

    changeDepartment(item) {
        this.chageRespondent({ department: item && item.value });
    }

    changeRole(item) {
        this.chageRespondent({ role: item && item.value });
    }

    render() {
        const { authenticationStatus, departments, roles } = this;
        const { isSignedIn, user } = authenticationStatus;
        const { respondent } = this.state;

        if (!isSignedIn) {
            return <SignInDetails status={authenticationStatus} />
        }

        return <form>            
            <div className="form-item">
                <p>
                    You are signed in as <strong>{user.label}</strong>
                </p>
            </div>
            <div className="form-item">
                <label>Organisation</label>
                <div className="value">{user.organisation.label}</div>
            </div>
            <div className="form-item">
                <label>Department</label>
                <div className="value">
                    <Select
                        name="respondent-department"
                        clearable={false}
                        value={respondent.department}
                        onChange={this.changeDepartment.bind(this)}
                        options={toSelectOptions(departments)}
                    />
                </div>
            </div>
            <div className="form-item">
                <label>Role</label>
                <div className="value">
                    <Select
                        name="respondent-department"
                        clearable={false}
                        value={respondent.role}
                        onChange={this.changeRole.bind(this)}
                        options={toSelectOptions(roles)}
                    />
                </div>
            </div>
        </form>;
    }
}