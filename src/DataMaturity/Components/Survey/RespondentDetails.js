import React from 'react';
import Select from 'react-select';
import SignInDetails from '../SignInDetails';
import common from '../../common.js';

export default class RespondentDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    chageRespondent(respondentProps) {
        this.props.onRespondentChanged(respondentProps);
    }

    changeDepartment(item) {
        this.chageRespondent({ department: item && item.value });
    }

    changeRole(item) {
        this.chageRespondent({ role: item && item.value });
    }

    render() {
        const { authStatus, respondent, options } = this.props;
        const { departments, roles } = options;
        const { isSignedIn, user } = authStatus;

        if (!isSignedIn) {
            return <SignInDetails status={authStatus} />
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
                        options={common.toSelectOptions(departments)}
                    />
                </div>
            </div>
            <div className="form-item">
                <label>Role</label>
                <div className="value">
                    <Select
                        name="respondent-role"
                        clearable={false}
                        value={respondent.role}
                        onChange={this.changeRole.bind(this)}
                        options={common.toSelectOptions(roles)}
                    />
                </div>
            </div>
        </form>;
    }
}