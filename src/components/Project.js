
import React, { Component } from 'react';
import Portal from 'react-portal';

import Select from 'react-select';
import ReactBootstrapSlider from 'react-bootstrap-slider';
// import '../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css';

import _ from 'lodash';
import classNames from 'classnames';

import {current_tick} from '../App';
import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';
import ProjectName from './ProjectName';
import ProjectProgressBar from './ProjectProgressBar';
import ProjectDeadlineBar from './ProjectDeadlineBar';

import {skills_names, skills, technologies, project_kinds, project_platforms} from '../game/knowledge';




class Project extends Component {
    constructor(props) {
        super(props);

        this.manage = this.manage.bind(this);
        this.manageAll = this.manageAll.bind(this);
        this.changeTechnology = this.changeTechnology.bind(this);
        this.finish = this.finish.bind(this);
        this.fix = this.fix.bind(this);
        this.open = this.open.bind(this);
        this.pause = this.pause.bind(this);
        this.unpause = this.unpause.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        if (!this.props.project.briefing) {
            this.props.project.briefing = true;
            this.refs.manage.openPortal();
        }
    }

    manage(event) {
        this.props.data.helpers.modifyRelation(event.target.id, this.props.project.id, event.target.checked);
    }

    manageAll(event) {
        this.props.data.helpers.modifyRelation(null, this.props.project.id, event.target.checked);
    }

    changeTechnology(event) {
        this.props.data.helpers.changeTechnology(event.target.id, this.props.project.id, event.target.checked);
    }

    open() {
        this.props.data.helpers.openProject(this.props.project.id);
    }
    pause() {
        this.props.data.helpers.pauseProject(this.props.project.id);
    }
    unpause() {
        this.props.data.helpers.unpauseProject(this.props.project.id);
    }

    close() {
        this.props.data.helpers.closeProject(this.props.project.id);
    }

    fix() {
        this.props.data.helpers.fixProject(this.props.project.id);
    }

    finish() {
        this.props.data.helpers.finishProject(this.props.project.id);
    }

    render() {
        const data = this.props.data;
        const project = this.props.project;
        console.log(project.estimate)
        console.log(project.original_estimate)
        console.log(project.done)
        console.log(project.bugs)
        const stats_data = _.mapValues(skills, (stat, key) => {
            return {name: key, // _.capitalize(key[0]),
                val:
                    <span>
                        <span className="text-warning">{project.needs(key)}</span>
                        {project.bugs[key] > 0 ? <span className="text-danger">+{project.bugs[key]}</span> : ''}
                        /<span>{project.estimate[key]}</span>
                    </span>
            };
        });

        const manage_button = <button className="btn btn-sm btn-success flex-element" style={{margin: '5px 5px 5px 5px'}}>Manage</button>;

        let onSelectChange = (e) => { 
        data.helpers.changeTeamSelector(); 
        data.helpers.modifyRelation(e.value.id, project.id); 
        data.helpers.modifyHoveredProjects();
        };

        //let unoccupied_workers = data.workers.filter((worker) => {return data.helpers.deepCheckRelation(worker, project)});

        let label = (worker) => {
            //TODO move to a element specific style sheet
            return <span key={worker.id}>
                        <span className="text-primary">{worker.name}</span>

                        <button style={{
                            margin: '0 5px',
                            maxWidth: '5%',
                            height: '10px',
                            padding: '0 8px',
                            position: 'relative'
                        }} className="btn btn-xs btn-info pr-button"
                                onClick={() => data.helpers.kickWorker(worker, project)}>
                        <span style={{
                            lineHeight: '10px',
                            position: 'absolute',
                            top: 'calc(50% - 5px)',
                            left: 'calc(50% - 3px)'
                        }} aria-hidden="true">&times;</span>
                        </button>
            </span>;
        };

        let team_ids = {};
        _.keys(data.relations).forEach((worker_id) => {
            let worker_projects = data.relations[worker_id];
            _.keys(worker_projects).forEach((project_id) => {
                let relation = worker_projects[project_id];
                if (relation && project_id === project.id) {
                    team_ids[worker_id] = true;
                }
            })
        });

        let team = [];
        data.workers.forEach((worker) => {
            if (worker.id in team_ids && worker.get_monthly_salary && data.helpers.deepCheckRelation(worker, project)) {
                team.push(worker);
            }
        });

        const team_label = team.map((worker) => { return label(worker); });

        let tech = [];
        if (project.id in data.projects_technologies) {
            Object.keys(data.projects_technologies[project.id]).forEach((tech_name) => {
                if (data.projects_technologies[project.id][tech_name]) {
                    tech.push(tech_name);
                }
            });
        }

        const tech_label = tech.map((tech_name) => { return label(tech_name, technologies[tech_name].acronym); });

        const start_pause_button =
            <span>
                {/*{project.stage}*/}
                {(project.is_paused)
                    ? <button className="btn btn-sm btn-success" onClick={this.unpause}>Start</button> : ''}
                {(project.stage === 'ready')
                    ? <button className="btn btn-sm btn-success" onClick={this.open}>Start</button> : ''}
                {(project.stage === 'open' && !project.is_paused)
                    ? <button className="btn btn-sm btn-warning" onClick={this.pause}>Pause</button> : ''}
            </span>;

        const reject_button = <button className="btn btn-sm btn-danger" onClick={() => {
            if (confirm("Reject project "+project.name+'? (penalty: '+project.penalty+')')) {
                this.close();
            } }}>Reject</button>;

        const release_button = project.doneQuantity() > 0 && project.type === 'own' && project.stage !== 'fixing' ? <button className="btn btn-success" onClick={() => {this.props.data.helpers.fixProject(project.id)}}>Release!</button> : '';

        //console.log(project_platforms[project.platform].icon)

        return (
            <div onMouseOver={() => {data.helpers.modifyHoveredObjects([project], team)}} 
                onMouseOut={() => {data.helpers.modifyHoveredObjects()}} 
                className={`card border fat ${data.hovered_projects_id.includes(project.id) ? 'hovered' : ''}`} 
                id={project.id}
            >
                <div>
                    <div className="flex-container-column">
                        <div className="flex-container-row">
                            <div className='project_icon'>
                                <div style={{ position: 'absolute' }}>
                                    <img alt={project.name + ' avatar'} src={require(`../../public/${project_platforms[project.platform].name}.svg`)} 
                                        width={60} height={60}/>
                                </div>
                                <div style={{ position: 'absolute' }}>
                                    <img alt={project.name + ' avatar'} src={require(`../../public/${project_kinds[project.kind].name}.svg`)}
                                        width={60} height={60}/>
                                </div>
                            </div>
                            <div className='flex-element'>
                                <label className="flex-element"> <ProjectName project={project} /> </label>
                                <label className="flex-element" style={{marginRight: '5px'}}> Reward: {project.reward}$ </label>
                                {(project.penalty > 0 ? <label className="flex-element"> Penalty: {project.penalty}$ </label> : ' ')}
                                <Portal ref="manage" closeOnEsc openByClickOn={manage_button}>
                                    <TeamDialog>
                                        <h4 className="flex-container-row">
                                            <label className="flex-element"> <ProjectName project={project} /> </label>
                                            <label className="flex-element">
                                                Reward: {project.reward}$
                                                {(project.penalty > 0 ? <label className="flex-element"> Penalty: {project.penalty}$ </label> : ' ')}
                                            </label>
                                            <div className="flex-element">
                                                <label>
                                                    {start_pause_button}
                                                    {reject_button}
                                                    {release_button}
                                                </label>
                                            </div>
                                        </h4>
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div>
                                                    {project.deadline > 0 && project.deadline !== Number.POSITIVE_INFINITY ? <div key="deadline" className="row">
                                                        <div className="col-md-2">Deadline</div>
                                                        <div className="col-md-10 progress">
                                                            <div className={classNames('progress-bar', (project.deadline / project.deadline_max < 0.1 ? 'bg-danger' : 'bg-warning'))} role="progressbar"
                                                                 style={{width: (100-(project.deadline / project.deadline_max * 100))+'%'}}>
                                                                <label>{project.deadline_max - project.deadline} hours</label>
                                                            </div>
                                                            <div className="progress-bar bg-success" role="progressbar"
                                                                 style={{width: (project.deadline / project.deadline_max * 100)+'%'}}>
                                                                <label>{project.deadline} hours</label>
                                                            </div>
                                                        </div>
                                                    </div> : ''}
                                                    <div className="flex-container-row">
                                                        <div className="flex-element"> Iteration: {project.iteration} </div>
                                                        <div className="flex-element"> Tasks: {project.tasksQuantity()}/{project.planedTasksQuantity()} </div>
                                                        <div className="flex-element"> Bugs: <label className="text-danger">{project.bugsQuantity()}</label></div>
                                                        <div className="flex-element"> Complexity: {project.complexity} </div>
                                                    </div>

                                                    <div>
                                                        {project.type === 'draft' && project.stage === 'ready'
                                                            ? skills_names.map((skill) => {
                                                                return <div key={skill} className="row">
                                                                    <div className="col-md-2">{skill}</div>
                                                                    <div className="col-md-10 ">
                                                                        <ReactBootstrapSlider
                                                                            scale='logarithmic'
                                                                            value={project.estimate[skill]}
                                                                            change={(e) => { project.estimate[skill] = e.target.value; project.original_estimate[skill] = e.target.value; }}
                                                                            step={1}
                                                                            max={100000}
                                                                            min={0}/>
                                                                    </div>
                                                                </div>;
                                                            }) : ''}
                                                    </div>
                                                    <div>
                                                        {project.type === 'draft' && project.stage === 'ready'
                                                            ? ''
                                                            : skills_names.map((skill) => {
                                                                //     console.log(project);
                                                                let tasks = project.needs(skill);
                                                                if (tasks === Number.POSITIVE_INFINITY) { tasks = 0; }
                                                                let bugs = project.bugs[skill];
                                                                let done = project.done[skill];

                                                                let max_skill = _.maxBy(_.keys(project.estimate), function (skill) {
                                                                    return Math.max((project.needs(skill) !== Number.POSITIVE_INFINITY) ? project.needs(skill) : 0, project.estimate[skill], project.done[skill]) + project.bugs[skill];
                                                                });

                                                                let max = Math.max(
                                                                    (project.needs(max_skill) !== Number.POSITIVE_INFINITY) ? project.needs(max_skill) : 0,
                                                                    (project.estimate[max_skill] !== Number.POSITIVE_INFINITY) ? project.estimate[max_skill] : 0,
                                                                    project.done[max_skill]) + project.bugs[max_skill];//, project.needs(max_skill)) + project.bugs[max_skill];

                                                                if (max === 0) max = 1;

                                                                let tasks_percent = tasks / max * 100;
                                                                let bugs_percent = bugs / max * 100;
                                                                let done_percent = done / max * 100;

                                                                //   console.log(tasks_percent, bugs_percent, done_percent);

                                                                return <div key={skill} className="row">
                                                                    <div className="col-md-2">{skill}</div>
                                                                    <div className="col-md-10 progress">
                                                                        <div className="progress-bar bg-warning" 
                                                                            role="progressbar" 
                                                                            style={{width: tasks_percent + '%'}}> 
                                                                            {tasks ? <label>{tasks} tasks</label> : ''}
                                                                        </div>
                                                                        <div className="progress-bar bg-danger" 
                                                                            role="progressbar" 
                                                                            style={{width: bugs_percent + '%'}}>
                                                                                {bugs ? <label>{bugs} bugs</label> : ''}
                                                                        </div>
                                                                        <div className="progress-bar bg-success" 
                                                                            role="progressbar" 
                                                                            style={{width: done_percent + '%'}}>
                                                                                {(done) ? <label>{done} done</label> : ''}
                                                                        </div>
                                                                    </div>
                                                                </div>;
                                                            })
                                                        }
                                                    </div>

                                                    {data.helpers.getTechnology(project.id, 'refactoring') ? <div key="refactoring" className="row">
                                                        <div className="col-md-2">Refactoring</div>
                                                        <div className="col-md-10 progress">
                                                            <div className="progress-bar bg-warning" role="progressbar"
                                                                 style={{width: (project.complexity / project.complexity_max * 100)+'%'}}>
                                                                <label>{project.complexity} complexity</label>
                                                            </div>
                                                            <div className="progress-bar bg-success" role="progressbar"
                                                                 style={{width: (100-(project.complexity / project.complexity_max * 100))+'%'}}>
                                                                {(project.complexity_max - project.complexity > 0) ?
                                                                    <label>{project.complexity_max - project.complexity} refactored</label> : ''}
                                                            </div>
                                                        </div>
                                                    </div> : ''}

                                                    {project.tests > 0 ? <div key="tests" className="row">
                                                        <div className="col-md-2">Tests</div>
                                                        <div className="col-md-10 progress">
                                                            <div className="progress-bar bg-warning" role="progressbar"
                                                                 style={{width: (100-(project.tests / project.planedTasksQuantity() * 100))+'%'}}>
                                                                <label>{project.planedTasksQuantity()-project.tests} tasks</label>
                                                            </div>
                                                            <div className="progress-bar bg-success" role="progressbar"
                                                                 style={{width: (project.tests / project.planedTasksQuantity() * 100)+'%'}}>
                                                                {(project.tests) ?<label>{project.tests} done</label> : ''}
                                                            </div>
                                                        </div>
                                                    </div> : ''}

                                                </div>
                                                <div className="card border">
                                                    <div>
                                                        {this.props.data.workers.map((worker) => {
                                                            const stats_data = _.mapValues(worker.stats, (val, skill) => {
                                                                return {name: skill,
                                                                    val: <div key={worker.id + project.id} className="">
                                                                        <label style={{width: '100%'}}>
                                                                            <input
                                                                                type="checkbox"
                                                                                id={worker.id || ''}
                                                                                checked={data.helpers.getRelation(worker.id, project.id, skill)}
                                                                                onChange={(event) => {
                                                                                    data.helpers.modifyRelation(event.target.id, project.id, event.target.checked, skill);
                                                                                }}/>
                                                                            {worker.getStatsData(skill)}
                                                                        </label>
                                                                    </div>};
                                                            });
                                                            return <div key={worker.id + project.id}>
                                                                <div>{worker.name}</div>
                                                                <StatsBar stats={stats_data} data={this.props.data} />
                                                            </div>
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card border slim-left">
                                                    <div className="col slim-left">
                                                        {data.projects_known_technologies.map(
                                                            (technology, i) => <div key={technology} className="row-md-1">
                                                                <div className="form-check-checkbox slim-margin">
                                                                    <label>
                                                                        <h5 className="text-center slim">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={technology}
                                                                                checked={data.helpers.getTechnology(project.id, technology)}
                                                                                onChange={this.changeTechnology}/>
                                                                            {technologies[technology].name}
                                                                        </h5>
                                                                        <p className="small slim">{technologies[technology].description}</p>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {(current_tick > (24*30*3)) ? Object.keys(technologies).map(
                                                            (technology, i) => <div key={technology} className="row-md-1">
                                                                <div className="form-check-checkbox slim-margin small">
                                                                    {!data.projects_known_technologies.includes(technology)
                                                                        ? <label>
                                                                            <h5 className="text-center slim">
                                                                                <button
                                                                                    className={technologies[technology].price <= data.money ? "btn btn-success btn-sm" : "btn btn-secondary btn-sm disabled"}
                                                                                    onClick={() => { if (technologies[technology].price <= data.money) data.helpers.unlockTechnology(technology); }}
                                                                                >
                                                                                    Unlock {technologies[technology].name} {technologies[technology].price}$
                                                                                </button>

                                                                            </h5>
                                                                            <p className="small slim">{technologies[technology].description}</p>
                                                                        </label> : ''}
                                                                </div>
                                                            </div>
                                                        ) : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TeamDialog>
                                </Portal>
                            </div>
                            </div>
                        </div>

                </div>

                {/*{project.deadline > 0 && project.deadline !== Number.POSITIVE_INFINITY ?
                    <div className="progress">
                        <div className={classNames('progress-bar', (project.deadline / project.deadline_max < 0.1 ? 'bg-danger' : 'bg-warning'))} role="progressbar"
                             style={{width: (100-(project.deadline / project.deadline_max * 100))+'%'}}>
                            <label>{project.deadline_max - project.deadline} gone</label>
                        </div>
                        <div className="progress-bar bg-success" role="progressbar"
                             style={{width: (project.deadline / project.deadline_max * 100)+'%'}}>
                            <label>{project.deadline} to deadline</label>
                        </div>
                    </div> : ''}*/}
                <ProjectDeadlineBar project={project}/>
                <ProjectProgressBar project={project}/>

                <StatsBar stats={stats_data} data={this.props.data} />

                <div className="flex-container-row slim">
                    <div className="flex-element"> Tasks: {project.tasksQuantity()}/{project.planedTasksQuantity()} </div>
                    <div className="flex-element"> Bugs: <label className="text-danger">{project.bugsQuantity()}</label> </div>
                    <div className="flex-element"> Complexity: {project.complexity} </div>
                    <div className="flex-element"> Iteration: {project.iteration} </div>
                </div>

                <div className="small slim">
                    <p className="small slim">Team: {team_label}
                        <button className={'btn btn-info pr-button'+ data.project_team_selector === project.id ? 'active ' : ''}
                                onClick={() => data.helpers.changeTeamSelector(project)}
                                >Add</button>
                    </p>
                    {data.project_team_selector === project.id ? <div>
                        <Select onChange={(e) => onSelectChange(e)}
                                options={data.workers.map((worker) => {return {value: worker, label: worker.name}})}
                                value={null}/>
                    </div> : null}
                    {tech.length ? <p className="small slim">Tech: {tech_label}</p> : ''}
                </div>
            </div>
        );
    }
}

export default Project;
