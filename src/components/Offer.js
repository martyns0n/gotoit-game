import React, { Component } from 'react';
import Portal from 'react-portal';

import SimpleModal from './SimpleModal';
import ProjectOfferBlock from './ProjectOfferBlock';
import {project_kinds, project_platforms, skills} from "../game/knowledge";
import _ from "lodash";
import StatsBar from './StatsBar';

import ProjectName from './ProjectName';


class Offer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //   end_screen_project: null
        };

    }
    acceptOffered(event) {
        this.props.data.helpers.acceptOffered(event.target.id);
        this.props.closePopup();
    }

    startOffered(event) {
        this.props.data.helpers.startOffered(event.target.id);
        this.props.closePopup();
    }

    reject(event) {
        this.props.data.helpers.rejectOffered(event.target.id);
        this.props.closePopup();
    }


    render() {
        const data = this.props.data;
        let project = this.props.project;


        const stats_data = _.mapValues(skills, (stat, key) => {
            return {name: key, val: <span>{project.needs(key)}</span>};
        });

        return (
            <div>
                <div>
                    <button className="btn btn-warning float-right" onClick={() => {
                        //data.helpers.projectArchiving();
                        this.props.closePopup();
                    }}>Close</button>
                </div>
                <div>
                    <div className='flexbox'>
                        <span style={{position: 'relative', width: '200px', height: '200px'}}>
                            <img
                                style={{ position: 'absolute'}}
                                width={200}
                                height={200}
                                alt={project.name + ' avatar'}
                                src={project.avatar.platform}
                            />
                            <img
                                style={{ position: 'absolute'}}
                                width={200}
                                height={200}
                                alt={project.name + ' avatar'}
                                src={project.avatar.kind}
                            />
                        </span>
                        <span className='flex-grow'>
                            <ProjectName project={project}/>
                            <div>
                                <span>Deadline: {project.getDeadlineText()}</span>
                                <span>
                                    <h4 className="project-reward text-success"> Reward: ${project.reward}</h4>
                                </span>
                                {(project.penalty > 0
                                        ? <span> <h4 className="project-penalty text-warning">Penalty : ${project.penalty}</h4></span>
                                        : ' '
                                )}
                            </div>
                        </span>
                    </div>
                    <div className="moat slim_top">
                        <div key={project.id} className="card">

                            <StatsBar stats={stats_data} data={this.props.data}/>
                            {
                                project.stage === 'ready' ?
                                    <div className="btn-group">
                                        <button className="btn btn-success" id={project.id} onClick={(e) => this.acceptOffered(e)}>
                                            Accept
                                        </button>
                                        &nbsp;
                                        <button className="btn btn-warning" id={project.id} onClick={(e) => this.startOffered(e)}>
                                            Start
                                        </button>
                                        &nbsp;
                                        <button className="btn btn-danger" id={project.id} onClick={(e) => this.reject(e)}>Hide</button>
                                    </div>
                                    : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Offer;