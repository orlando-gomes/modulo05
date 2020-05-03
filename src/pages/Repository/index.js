import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { GoIssueOpened, GoIssueClosed } from 'react-icons/go';

import api from '../../services/api';
import Container from '../../components/Container';
import {
  Loading,
  Owner,
  IssueList,
  States,
  StateButton,
  LinkList,
} from './styles';

/* Propriedades enviadas como parâmetros para o nosso componente pela URL
 também devem ter a parte de PropTypes regularizada.
 Então, vamos adicionar a biblioteca prop-types */
export default class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    issueState: 'open',
    currentPage: 1,
    openIssuesCount: 0,
    openIssuesFinalPage: 1,
    closedIssuesCount: 0,
    closedIssuesFinalPage: 1,
    allIssuesCount: 0,
    allIssuesFinalPage: 1,
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);
    let numberOfOpen = 0;
    let openIssuesFinalPage = 1;
    let numberOfClosed = 0;
    let closedIssuesFinalPage = 1;
    let numberOfAll = 0;
    let allIssuesFinalPage = 1;

    const [repository, openIssues, closedIssues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          /* per_page: 5,
          page: 1, */
        } /*
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        }, */,
      }),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'closed',
          /* per_page: 5,
          page: 1, */
        },
      }),
    ]);

    if (!openIssues.headers.link) {
      numberOfOpen = openIssues.data.length;
    } else {
      const links = String(openIssues.headers.link).split(';');
      const linkLast = links[1].split(',')[1];
      // eslint-disable-next-line prefer-destructuring
      openIssuesFinalPage = linkLast.split('page=')[1].split('>')[0];
      const openLastPage = await api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          page: openIssuesFinalPage,
        },
      });
      numberOfOpen = (openIssuesFinalPage - 1) * 30 + openLastPage.data.length;
    }

    if (!closedIssues.headers.link) {
      numberOfClosed = closedIssues.data.length;
    } else {
      const links = String(closedIssues.headers.link).split(';');
      const linkLast = links[1].split(',')[1];
      // eslint-disable-next-line prefer-destructuring
      closedIssuesFinalPage = linkLast.split('page=')[1].split('>')[0];
      const openLastPage = await api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'closed',
          page: closedIssuesFinalPage,
        },
      });
      numberOfClosed =
        (closedIssuesFinalPage - 1) * 30 + openLastPage.data.length;
    }

    numberOfAll = numberOfOpen + numberOfClosed;
    allIssuesFinalPage = Math.floor(numberOfAll / 30);

    this.setState({
      repository: repository.data,
      issues: openIssues.data,
      openIssuesCount: numberOfOpen,
      openIssuesFinalPage,
      closedIssuesFinalPage,
      closedIssuesCount: numberOfClosed,
      allIssuesCount: numberOfAll,
      allIssuesFinalPage,
      loading: false,
    });
  }

  async getIssuesByState(issueState) {
    const { repository } = this.state;

    const issues = await api.get(`/repos/${repository.full_name}/issues`, {
      params: {
        state: issueState,
        page: 1,
      },
    });

    this.setState({
      issues: issues.data,
      issueState,
      currentPage: 1,
    });
  }

  async handlePageChanging(page) {
    const { repository, issueState } = this.state;

    const issues = await api.get(`/repos/${repository.full_name}/issues`, {
      params: {
        state: issueState,
        page,
      },
    });

    this.setState({
      issues: issues.data,
      currentPage: page,
    });
  }

  render() {
    const {
      repository,
      issues,
      issueState,
      currentPage,
      openIssuesCount,
      closedIssuesCount,
      allIssuesCount,
      openIssuesFinalPage,
      closedIssuesFinalPage,
      allIssuesFinalPage,
      loading,
    } = this.state;

    let numberOfPages = 0;
    if (issueState === 'open') {
      numberOfPages = openIssuesFinalPage;
    } else if (issueState === 'closed') {
      numberOfPages = closedIssuesFinalPage;
    } else {
      numberOfPages = allIssuesFinalPage;
    }

    if (loading) {
      return <Loading>Carregando</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <States>
          <StateButton
            type="button"
            active={issueState === 'open' ? 'active' : ''}
            onClick={() => this.getIssuesByState('open')}
          >
            Open ({openIssuesCount})
          </StateButton>
          <StateButton
            type="button"
            active={issueState === 'closed' ? 'active' : ''}
            onClick={() => this.getIssuesByState('closed')}
          >
            Closed ({closedIssuesCount})
          </StateButton>
          <StateButton
            type="button"
            active={issueState === 'all' ? 'active' : ''}
            onClick={() => this.getIssuesByState('all')}
          >
            All ({allIssuesCount})
          </StateButton>
        </States>

        <IssueList>
          {issues.map((issue) => (
            <li key={String(issue.id)}>
              {issue.state === 'open' ? (
                <GoIssueOpened color="green" size={18} />
              ) : (
                <GoIssueClosed color="red" size={18} />
              )}
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map((label) => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <LinkList>
          {currentPage === 1 ? (
            ''
          ) : (
            <button type="button" onClick={() => this.handlePageChanging(1)}>
              Pág 1
            </button>
          )}
          {currentPage === 1 ? (
            ''
          ) : (
            <button
              type="button"
              onClick={() => this.handlePageChanging(currentPage - 1)}
            >
              Pág. anterior
            </button>
          )}
          <span>Atual: {currentPage}</span>
          {currentPage === numberOfPages ? (
            ''
          ) : (
            <button
              type="button"
              onClick={() => this.handlePageChanging(currentPage + 1)}
            >
              Pág. posterior
            </button>
          )}
          {currentPage === numberOfPages ? (
            ''
          ) : (
            <button
              type="button"
              onClick={() => this.handlePageChanging(numberOfPages)}
            >
              Pág. Final
            </button>
          )}
        </LinkList>
      </Container>
    );
  }
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
