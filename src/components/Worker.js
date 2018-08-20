/* eslint-disable */
import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';
import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';
import ProjectName from './ProjectName';
import StatsProgressBar from './StatsProgressBar';
import { colors } from '../game/knowledge/colors';
import { workers_bonus_items } from '../game/knowledge/workers';
import { skills_names } from '../game/knowledge/skills';
import { education } from '../game/knowledge/education';
import WorkerHappinessBar from './WorkerHappinessBar';
import WorkerStaminaBar from './WorkerStaminaBar';


import Character from './content/Character';
import Instrumentary from './content/Instrumentary';


//import {addAction} from '../components/ToastNest';



const components = {
  Character: Character,
  Instrumentary: Instrumentary
};

class Worker extends Component {
  constructor(props) {
    super(props);
    this.manage = this.manage.bind(this);
    this.manageAll = this.manageAll.bind(this);
    this.dismiss = this.dismiss.bind(this);
  }
  // shouldComponentUpdate() {
  //   return false;
  // }
  UNSAFE_componentWillMount() {
    let data = this.props.data;
    data.workers.forEach(worker => {
      if (worker.stats.design > data.max_stat)
        data.max_stat = worker.stats.design;
      if (worker.stats.program > data.max_stat)
        data.max_stat = worker.stats.program;
      if (worker.stats.manage > data.max_stat)
        data.max_stat = worker.stats.manage;
    });
  }
  componentDidMount() {
    /*
        if (this.props.worker.is_player) {
            addAction('This is the management screen of your character. Here you can select their roles in the company. Review carefully information on this screen, then try a Training Project.', {timeOut: 10000, extendedTimeOut: 5000}, 'success');
        }
        */
    //this.refs.manage.openPortal();
  }

  manage(event) {
    this.props.data.helpers.modifyRelation(
      this.props.worker.id,
      event.target.id,
      event.target.checked
    );
  }

  manageAll(event) {
    this.props.data.helpers.modifyRelation(
      this.props.worker.id,
      null,
      event.target.checked
    );
  }

  dismiss() {
    this.props.data.helpers.dismissEmployer(this.props.worker.id);
  }

  teach(skill, source) {
    //  console.log(skill, source);

    switch (source) {
      case 'training':
        this.props.data.helpers.trainingProject(this.props.worker, skill);
        break;
      default:
        console.log('WTF?');
    }
  }

  render() {
    const ContentComponent = components[this.props.data.content];
    const data = this.props.data;
    const worker = this.props.worker;

    const manage_button = (
      <button className="btn btn-primary btn-xs">Manage</button>
    );

    const stats_progressbar_data = _.mapValues(worker.stats, (val, stat) => {
      return {
        name: stat,
        value: worker.getStatsData(stat),
        color: colors[stat].colorCompleted
      };
    });

    /*const stats_data = _.mapValues(worker.stats, (val, stat) => {
            return {
                name: stat,
                val: worker.getStatsData(stat)
            };
        });*/

    const efficiency_data = {
      work_load: { name: 'Work Load', val: worker.workloadPenalty() },
      work_difficulty: {
        name: 'Task Difficulty',
        val: worker.difficultyPenalty()
      },
      education: { name: 'Education Balance', val: worker.educationPenalty() },
      collective: { name: 'Collective', val: worker.collectivePenalty() }
    };

    return (
      <div
        onMouseOver={() => {
          data.helpers.modifyHoveredObjects(
            data.projects.filter(project => {
              return data.helpers.deepCheckRelation(worker, project);
            }),
            [worker]
          );
        }}
        onMouseOut={() => {
          data.helpers.modifyHoveredObjects();
        }}
        className={`card worker gap-items-2 ${
          data.hovered_workers_id || [].includes(worker.id) ? 'hovered' : ''
        } ${worker.in_vacation ? 'vacation' : ''}`}
        id={worker.id}
      >
        <img
          className="worker-avatar"
          alt={worker.name + ' avatar'}
          src={worker.avatar}
        />
        <div className="worker-info">
          <header className="card-header">
            <span className="worker-name"> {worker.name} </span>

            <Portal
              ref="manage"
              closeOnEsc
              closeOnOutsideClick
              openByClickOn={manage_button}
            >

              <TeamDialog>

                <div className="modal-header">
                  <img
                    className="worker-avatar"
                    alt={worker.name + ' avatar'}
                    src={worker.avatar}
                  />
                  <div className="worker-info">
                    <h3 className="worker-name">
                      {worker.name}
                      {worker.in_vacation ? ' on vacation! ' : ''}
                    </h3>
                    <div className="worker-happiness">
                      <WorkerHappinessBar worker={worker} />
                    </div>

                    <div className="worker-stamina">
                      <WorkerStaminaBar worker={worker} />

                      {/* ====PROPOSE VACATION BUTTON==== */}
                      {worker.in_vacation || worker.to_vacation ? (
                        worker.in_vacation ? (
                          ' Worker on vacation! '
                        ) : (
                          ' Going on vacation in ' +
                          Math.floor(worker.to_vacation_ticker / 24) +
                          ' days. '
                        )
                      ) : (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => {
                            worker.proposeVacation();
                          }}
                        >
                          Propose Vacation
                        </button>
                      )}
                    </div>

                    <div className="worker-stats">
                      {skills_names.map(skill => {
                        return (
                          <StatsProgressBar
                          key={skill}
                          type={skill}
                          stats={stats_progressbar_data}
                          worker={worker}
                          data={data}
                          />
                        )
                      })}
                    </div>

                    {/* <p>
                      {worker.tellFeelings()}
                    </p> */}
                  </div>
                </div>

                <div className="modal-body">
                  <ul className="nav nav-tabs nav-tabs-light-mode activity-toolbar">
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        onClick={() => {
                          data.helpers.changeContent('Character');
                        }}
                      >
                        <h4>Character</h4>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        onClick={() => {
                          data.helpers.changeContent('Instrumentary');
                        }}
                      >
                        <h4>Instrumentary</h4>
                      </a>
                    </li>
                  </ul>



                    <div className="tab-content">
                      <ContentComponent data={this.props.data} />
                    </div>



                  {/* <div>
                    {`Character: ${worker.character.name}. ${worker.character.description}.`}
                  </div>

                  {worker.is_player ? (
                    ''
                  ) : (
                    <span>
                      Worker salary: ${worker.getSalary()}. Overrate bonus:{' '}
                      {worker.getOverrate()}
                      %.
                      <button
                        className="btn btn-danger btn-link"
                        onClick={() => {
                          data.helpers.riseEmployer(worker.id);
                        }}
                      >
                        Rise Salary
                      </button>
                    </span>
                  )}
                  {worker.get_monthly_salary ? (
                    ''
                  ) : (
                    <span>
                      <button
                        className="btn btn-danger btn-link"
                        onClick={() => {
                          data.helpers.paySalary(worker);
                        }}
                      >
                        Pay a debt
                      </button>
                    </span>
                  )}

                  <ul>
                    <p>
                      Hired{' '}
                      {Math.ceil(
                        (this.props.data.date.tick - worker.facts.tick_hired) /
                          24
                      )}{' '}
                      days ago.
                      {!worker.is_player ? (
                        <span>Got {worker.facts.money_earned}$ of salary.</span>
                      ) : (
                        ''
                      )}
                      Finished {worker.facts.project_finished} project. Did{' '}
                      {worker.facts.tasks_done} of{' '}
                      {worker.facts.tasks_done + worker.facts.bugs_passed}{' '}
                      tasks. Passed {worker.facts.bugs_passed} bugs. Did{' '}
                      {worker.facts.refactored} refactoring, wrote{' '}
                      {worker.facts.tests_wrote} tests and retrospected{' '}
                      {worker.facts.retrospected} tasks.
                    </p>
                  </ul>
                  <div className="card text-center">
                    bonus items
                    <div>
                      <div className="">
                        {skills_names.map(skill => {
                          return (
                            <div className=" flex-container-column" key={skill}>
                              {Object.keys(workers_bonus_items[skill]).map(
                                item_key => {
                                  let item =
                                    workers_bonus_items[skill][item_key];
                                  return worker.items[skill][item_key] ===
                                    true ? (
                                    <div className="" key={item_key}>
                                      <span className="badge">
                                        {item.name} {item.description}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="" key={item_key}>
                                      <button
                                        className={
                                          data.money >= item.money
                                            ? 'btn btn-info btn-sm'
                                            : 'btn btn-info btn-sm disabled'
                                        }
                                        title={item.description}
                                        id={item}
                                        onClick={() => {
                                          if (data.money >= item.money) {
                                            data.helpers.buyItem(
                                              worker,
                                              skill,
                                              item_key
                                            );
                                          }
                                        }}
                                      >
                                        Buy {item.name} ${item.money}
                                      </button>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  deprecated training project
                  <div>
                    <div className="card text-center">
                      {Object.keys(education).map(
                        source =>
                          !education[source].hide ? (
                            <div className="" key={source}>
                              {skills_names.map(skill => {
                                return (
                                  <div className="" key={skill}>
                                    <button
                                      className="btn btn-info"
                                      title={education[source].description}
                                      id={source}
                                      onClick={() => this.teach(skill, source)}
                                    >
                                      {education[source].name}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            ''
                          )
                      )}
                    </div>
                  </div>
                  <div>
                    Which projects {worker.name} has to work?
                    <div className="card">
                      {data.projects.map(project => {
                        const stats_data = _.mapValues(
                          project.needs,
                          (val, skill) => {
                            return {
                              name: skill,
                              val: (
                                <div key={worker.id + project.id} className="">
                                  <div style={{ width: '100%' }}>
                                    <input
                                      type="checkbox"
                                      id={project.id || ''}
                                      checked={data.helpers.getRelation(
                                        worker.id,
                                        project.id,
                                        skill
                                      )}
                                      onChange={event => {
                                        data.helpers.modifyRelation(
                                          worker.id,
                                          event.target.id,
                                          event.target.checked,
                                          skill
                                        );
                                      }}
                                    />
                                    {project.needs(skill) +
                                      '/' +
                                      project.estimate[skill]}
                                  </div>
                                </div>
                              )
                            };
                          }
                        );
                        return (
                          <div key={worker.id + project.id}>
                            <div>
                              <ProjectName project={project} />
                            </div>
                            <StatsBar
                              stats={stats_data}
                              data={this.props.data}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div> */}
                  <div>
                    {worker.is_player ? (
                      ''
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={this.dismiss}
                      >
                        Dismiss an employee
                      </button>
                    )}
                  </div>
                </div>
              </TeamDialog>
            </Portal>
          </header>

          <div className="card-body worker-stats">
            {/* {worker.is_player ? 'Player' : <span>{worker.getSalary()}$</span>} */}
            {/* {worker.get_monthly_salary ? '' : ' unpaid! '} */}
            {/* <div classNames('progress-bar', (100 / worker.getEfficiency() < 0.5 ? 'bg-danger' : 'bg-warning')) role="progressbar"  */}

            <WorkerHappinessBar worker={worker} />
            <WorkerStaminaBar worker={worker} />
            <div className="worker-skills">
              <StatsProgressBar
                type={'design'}
                max_stat={data.max_stat}
                stats={stats_progressbar_data}
                worker={worker}
                data={data}
              />
              <StatsProgressBar
                type={'program'}
                max_stat={data.max_stat}
                stats={stats_progressbar_data}
                worker={worker}
                data={data}
              />
              <StatsProgressBar
                type={'manage'}
                max_stat={data.max_stat}
                stats={stats_progressbar_data}
                worker={worker}
                data={data}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Worker;
