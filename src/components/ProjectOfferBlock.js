import React, { Component } from 'react';
import _ from 'lodash';

import StatsBar from './StatsBar';
import ProjectName from './ProjectName';

import {skills} from '../game/knowledge';


class ProjectOfferBlock extends Component {

    acceptOffered(event) {
        this.props.data.helpers.acceptOffered(event.target.id);
    }

    startOffered(event) {
        this.props.data.helpers.startOffered(event.target.id);
    }

    reject(event) {
        this.props.data.helpers.rejectOffered(event.target.id);
    }

    render() {
        let candidate = this.props.candidate;
        let type = this.props.type;

        const stats_data = _.mapValues(skills, (stat, key) => {
            return {name: key, val: <span>{candidate.needs(key)}</span>};
        });

        return <div key={candidate.id} className="card">
            <ProjectName project={candidate}/>
            <div>
                <label>Deadline: {candidate.getDeadlineText()}</label>&nbsp;
                <label>Reward: {candidate.reward}$</label>&nbsp;
                {candidate.penalty > 0 ? <label>Penalty: {candidate.penalty}$</label> : ''}
            </div>

            <StatsBar stats={stats_data} data={this.props.data}/>
            {
                candidate.stage === 'ready' ?
                    <div className="btn-group">
                        <button className="btn btn-success" id={candidate.id} onClick={(e) => this.acceptOffered(e)}>
                            Accept
                        </button>
                        &nbsp;
                        <button className="btn btn-warning" id={candidate.id} onClick={(e) => this.startOffered(e)}>
                            Start
                        </button>
                        &nbsp;
                        <button className="btn btn-danger" id={candidate.id} onClick={(e) => this.reject(e)}>Hide</button>
                    </div>
                : ''
            }

        </div>;
    }
}

export default ProjectOfferBlock;