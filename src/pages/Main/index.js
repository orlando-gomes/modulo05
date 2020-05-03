import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List, Span } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: '',
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({
        repositories: JSON.parse(repositories),
      });
    }
  }

  // salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = (e) => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async (e) => {
    const { newRepo, repositories } = this.state;

    e.preventDefault();

    this.setState({ loading: 'true' });

    try {
      repositories.map((repository) => {
        if (repository === newRepo || repository.name === newRepo) {
          throw new Error('Repositório duplicado');
        }
        return true;
      });

      const response = await api.get(`repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: '',
      });
    } catch (err) {
      if (err.message !== 'Repositório duplicado') {
        this.setState({
          repositories: [...repositories, newRepo],
        });
      }

      this.setState({
        newRepo: '',
        loading: '',
      });
    }
  };

  deleteRepository(repository) {
    const { repositories } = this.state;
    this.setState({
      repositories: repositories.filter((rep) => rep !== repository),
    });
  }

  render() {
    const { newRepo, loading, repositories } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map((repository) => (
            <li key={repository.name ? repository.name : repository}>
              <Span error={!repository.name}>
                {repository.name ? repository.name : repository}
              </Span>
              <Link
                to={
                  repository.name
                    ? `/repository/${encodeURIComponent(repository.name)}`
                    : ''
                }
                onClick={
                  repository.name
                    ? () => {}
                    : () => this.deleteRepository(repository)
                }
              >
                {repository.name ? 'Detalhes' : 'Inexistente'}
              </Link>
              {/* Mesmo trocando de a para Link o estilo se aplica */}
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
