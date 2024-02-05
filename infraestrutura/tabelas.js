class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        this.criarTbCiclos();
        this.criarTbUsuarios();
        this.criarTbPermissoes();
        this.criarTbUsuariosxPermissoes();
        this.criarTbPendencias();
        this.criaTbTipoAluno();
        this.criarTbAlunos(); 
        this.criarTbChecklist();
        this.criaTbAlunosxpendencias();
        this.criaTbDisciplinas();
        this.criaTbDocumentos();
        this.criaTbOrientador();
        this.criaTbTipoDocumento();
        this.criaTbEventos();
        this.criarTbMembros();
        this.criarTbMembrosXEventos();
        this.criarTbAnexos();
        this.criarTbAnexosXmembrosXgt();
        this.criarTbBancas();
        this.criaTbOrientandos();
        this.criaTbCursos();
        this.criaTbTipoDaBanca();
        this.criaTbStatus();
        this.criaTbATA();
        this.criaTbAreasConcentracao();
        this.criaTbLinhasPesquisas();
        this.criaTbFichaAvaliacao();
        this.criaTbMembroExterno();
        this.criaTbCoordenador();
        this.criaTbOrientacao();
        this.criaTbOrientacaoXanexos();
        this.criarTbDeclaracoes();
        this.criaTbGruposDeTrabalho();
        this.criaTbMembrosxgruposDeTrabalho();
        this.criaTbHabilidades();
        this.criaTbPerguntas();
        this.criaTbTesteVocacional();
        this.criaTbRespostas();
        this.criaTbVinculoInstitucional();
        this.criaTbLiderGt();
        this.criaTbLiderGtXGrupoTrabalho();
        this.criaTbAreasDeAtuacao();
        this.criaTbInstituicoes();
        this.criaTbAberturaTurma();
        this.criaTbPrioridades();
        this.criaTbSetores();
        this.criaTbChamados();
        this.criaTbChamadosXsetores();
        this.criaTbTiposChamados();
        this.criaTbOrientacaoXanexosXorientando();
        this.criarTbAnexosXchamados();
        this.criarTbEstados();
        this.criaTbSolicitacoes();
        this.criaTbTipoSolicitacoes();
        this.criaTbFolhaDeAprovacao();
        this.criaTbTemas();
        this.criaTbPlanos();
        this.criaTbAlunosXplanos();
        
        this.criaTbAlunosXtemas();
        this.criaTbRedacoes();
        this.criaTbCertificados();
        this.criaTbChamadosXComentarios();
        this.criaTbTipoNotificacao();
        this.criaTbNotificacoes();
        this.criaTbCredenciamento();
        this.criaTbChecklistCredenciamento();
        this.criaTbDocumentoCredenciamento();
        this.criaTbChecklistCredenciamentoXestado();
        this.criaTbChecklistCredenciamentoXinstrucoes();
        this.criarTbDeclaracaoDeOrientacao();
        this.criaTbBancasXmembroExterno();
        this.criaTbBancasXmembroInterno();
        this.criarTbTipoMembroDaBanca();
        this.criarTbMembrosDaBanca(); 
        this.criarTbTipoTurma();
    }

    /**
     * Criar tabela para especificar o tipo de turma
     * 0 - Ensino Fundamental
     * 1 - Ensino Medio
     * 2 - Ambos (Fundamental e Médio)
     * 
     * @return void
     */
    criarTbTipoTurma() {
        const sql = `CREATE TABLE IF NOT EXISTS tipo_turma (
            id INT NOT NULL AUTO_INCREMENT,
            id_tipoturma INT NOT NULL,
            turmas varchar(255),
            PRIMARY KEY(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else if (this.inserirTipoTurma === 0){
                console.log("Tabela tipo_turma criada com successo!");
                this.verificarTipoTurma();
            }
        });
    }

    /**
     * Verificar se a Tabela turma ja está preenchida
     * 
     * @return void
     */
    verificarTipoTurma() {
        const sql = `SELECT * from tipo_turma WHERE turmas = 'ENSINO_FUNDAMENTAL' OR turmas = 'ENSINO_MEDIO' OR turmas = 'ENSINO_FUNDAMENTAL_MEDIO'`;
        this.conexao.query(sql, (erro, resultados) => {
            if (erro) {
                console.log(erro);
            } else {
                //console.log(resultados);
                if (resultados.length === 0) {
                    this.inserirTipoTurma();
                }
                //console.log("Registros de permissoes criada com sucesso")
            }
        });
    }

    /**
     * Inserir especificações de cada turma no banco de dados
     * 
     * @return void
     */
    inserirTipoTurma() {
        const sql = `INSERT INTO tipo_turma (
            id_tipoturma,
            turmas
        )
        VALUES
        (
            1,
            'ENSINO_FUNDAMENTAL'
        ),
        (
            2,
            'ENSINO_MEDIO'
        ),
        (
            3,
            'ENSINO_FUNDAMENTAL_MEDIO'
        )
        `;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tipos de turma criados com sucesso")
            }
        });
    }

    criarTbCiclos() {
        const sql = `CREATE TABLE IF NOT EXISTS ciclos (   
        id int NOT NULL AUTO_INCREMENT,
        nome varchar(50) NOT NULL DEFAULT 'CICLO - ',   
        dataHoraCriacao datetime NOT NULL,     
        status varchar(20) NOT NULL DEFAULT 'ATIVO',
        id_usuario int NOT NULL,
        PRIMARY KEY(id) 
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de ciclos criada com sucesso")
            } 
        });
    }

    criarTbUsuarios() {
        const sql = `CREATE TABLE IF NOT EXISTS usuarios (
            id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
            cpf_cnpj varchar(20) NOT NULL DEFAULT '0',
            nome varchar(100) NOT NULL DEFAULT '0',
            email varchar(255) NOT NULL DEFAULT '0',
            dt_nascimento date NOT NULL,
            telefone varchar(50) NOT NULL DEFAULT '0',
            senha varchar(255) NOT NULL DEFAULT '0',
            status varchar(255) DEFAULT 'ATIVO', 
            dataHoraCriacao datetime NOT NULL,
            cep varchar(255) NOT NULL DEFAULT '0',
            estado varchar(255) NOT NULL DEFAULT '0',
            cidade varchar(255) NOT NULL DEFAULT '0',
            bairro varchar(255) NOT NULL DEFAULT '0',
            logradouro varchar(255) NOT NULL DEFAULT '0',
            complemento varchar(255) NOT NULL DEFAULT '0',
            numero varchar(255) NOT NULL,
            nacionalidade int(255) NOT NULL,
            naturalidade int(255) NOT NULL,
            estado_civil int(255) NOT NULL,
            rg varchar(20) NOT NULL,
            id_vinculoInstitucional int(11) DEFAULT NULL,
            id_setor int(11) NOT NULL, 
            sexo enum('M','F') NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de usuarios criada com sucesso");

            }
        });
    }

    criarTbPermissoes() {
        const sql = `CREATE TABLE IF NOT EXISTS permissoes (
            id int(11) NOT NULL AUTO_INCREMENT,
            nome varchar(100) NOT NULL DEFAULT '0',
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de permissões criada com sucesso");
                this.verificarPermissoes();
            }
        });
    } 
 
    criarTbUsuariosxPermissoes() {
        const sql = `CREATE TABLE IF NOT EXISTS usuariosxpermissoes (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL,
            id_permissao int(11) NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {

                console.log("Tabela de permissões criada com sucesso");
                this.verificarPermissoes();
            }
        });
    }

    verificarPermissoes() {
        const sql = `SELECT * from permissoes WHERE permissoes.nome = 'ADMIN' OR permissoes.nome = 'SECRETARIA'`;
        this.conexao.query(sql, (erro, resultados) => {
            if (erro) {
                console.log(erro);
            } else {
                //console.log(resultados);
                if (resultados.length === 0) {
                    this.inserirPermissoes();
                }
                //console.log("Registros de permissoes criada com sucesso")
            }
        });
    }

    inserirPermissoes() {
        const sql = `
        INSERT INTO permissoes (
            id,
            nome,
            dataHoraCriacao 
        )
        VALUES
            (   
                1,
                'ADMIN',
                '2022-03-16 15:51:44'
            ),
            (
                2,
                'SECRETARIA',
                '2022-03-16 15:51:44'
            ),
            (
                3,
                'POLO',
                '2022-03-16 15:51:44'
            ),
            (
                4, 
                'EVENTOS',
                '2022-03-16 15:51:44'
            ),
            (
                5, 
                'ORIENTADORES',
                '2022-03-16 15:51:44'
            ),
            (
                6,  
                'ORIENTANDOS',
                '2022-03-16 15:51:44'
            ),
            (
                7,  
                'COORDENADOR',
                '2022-03-16 15:51:44'
            ),
            (
                8,  
                'DIRETOR',
                '2022-03-16 15:51:44'
            ),
            (
                9,  
                'GRUPO DE TRABALHO',
                '2022-03-16 15:51:44'
            ),
            (
                10,  
                'CHAMADOS',
                '2022-03-16 15:51:44'
            ),
            (
                11,  
                'CONVENIOS',
                '2022-03-16 15:51:44'
            ),
            (
                12,  
                'PROFESSOR',
                '2022-03-16 15:51:44'
            ),
            (
                13,  
                'ALUNO',
                '2022-03-16 15:51:44'
            )
        `;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Registros de permissoes criada com sucesso")
            }
        });
    }

    // criarTbAlunos() {
    //     const sql = `CREATE TABLE IF NOT EXISTS alunos (
    //         id int(11) NOT NULL AUTO_INCREMENT, 
    //         nome varchar(255) DEFAULT '0',
    //         cpf varchar(15) DEFAULT '0',
    //         dataHoraCriacao datetime NOT NULL, 
    //         PRIMARY KEY(id)
    //       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

    //     this.conexao.query(sql, (erro) => {
    //         if (erro) {
    //             console.log(erro);
    //         } else {
    //             console.log("Tabela de alunos criada com sucesso");
    //         }
    //     });
    // }

    criarTbAlunos() {
        const sql = `CREATE TABLE IF NOT EXISTS alunos (
            id int(11) AUTO_INCREMENT NOT NULL,
            id_usuario int(11) NOT NULL,
            dataNascimento DATE NULL,
            rg varchar(50) DEFAULT '0',
            nacionalidade varchar(15) DEFAULT '0',  
            naturalidade varchar(50) DEFAULT '0',  
            pai varchar(255) DEFAULT '0',  
            mae varchar(255) DEFAULT '0', 
            situacaoTurma varchar(15) DEFAULT '0', 
            turma varchar(255) DEFAULT '0', 
            nomeInstituicao varchar(255) DEFAULT '0',
            dataHoraCriacao datetime NOT NULL,
            id_tipo int(11) NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
            FOREIGN KEY (id_tipo) REFERENCES tipo_aluno(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de alunos criada com sucesso");
            }
        });
    }

    criarTbChecklist() {
        const sql = `CREATE TABLE IF NOT EXISTS checklist (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL,
            id_ciclo int(11) NOT NULL,
            certificado_imp TINYINT NOT NULL DEFAULT '0',
            declaracao_imp TINYINT NOT NULL DEFAULT '0', 
            carimbos TINYINT NOT NULL DEFAULT '0',
            selo TINYINT NOT NULL DEFAULT '0',
            assinaturas TINYINT NOT NULL DEFAULT '0',
            listaImpresso TINYINT NOT NULL DEFAULT '0',
            etiquetaImpresso TINYINT NOT NULL DEFAULT '0',   
            observacao text NULL,
            data_diario date NULL DEFAULT NULL,
            solicitacao int(11) NULL DEFAULT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de checklist criada com sucesso");
            }
        });
    }

    criarTbAlunosPolo() {
        const sql = `CREATE TABLE IF NOT EXISTS alunos_polo (
            id int(11) NOT NULL AUTO_INCREMENT,
            data_solicitacao date NOT NULL,  
            dataHoraCriacao datetime NOT NULL,     
            status varchar(20) NOT NULL DEFAULT 'ATIVO',
            id_polo int(11) NOT NULL, 
            id_alunoG int(11) NOT NULL, 
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de alunos_polo criada com sucesso");
            }
        });
    }

    criarTbPendencias() {
        const sql = `CREATE TABLE IF NOT EXISTS pendencias (
        id int NOT NULL AUTO_INCREMENT,
        nome varchar(255) NOT NULL DEFAULT 0,  
        dataHoraCriacao datetime NOT NULL,     
        status varchar(20) NOT NULL DEFAULT 'ATIVO',
        id_usuario int NOT NULL,
        PRIMARY KEY(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de pendencias criada com sucesso")
            }
        });
    }

    criaTbAlunosxpendencias() {
        const sql = `CREATE TABLE IF NOT EXISTS alunosxpendencias (
            id int NOT NULL AUTO_INCREMENT,
            id_aluno int NOT NULL,
            id_pendencia int NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            status TINYINT NOT NULL DEFAULT 0,   
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de alunosXPendencias criada com sucesso")
            }
        });
    }

    criaTbProvas() {
        const sql = `CREATE TABLE IF NOT EXISTS provas (
            id int NOT NULL AUTO_INCREMENT,
            id_disciplina int NOT NULL, 
            serie int NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de provas criada com sucesso")
            }
        });
    }

    criaTbQuestoes() {
        const sql = `CREATE TABLE IF NOT EXISTS questoes (
            id int NOT NULL AUTO_INCREMENT,
            enunciado text,
            id_prova int NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de questoes criada com sucesso")
            }
        });
    }

    criaTbAlternativas() {
        const sql = `CREATE TABLE IF NOT EXISTS alternativas (
            id int NOT NULL AUTO_INCREMENT,
            enunciado varchar(255) NOT NULL DEFAULT '0',
            id_questao int NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de alternativas criada com sucesso")
            }
        });
    }

    // criaTbResposta() {
    //     const sql = `CREATE TABLE IF NOT EXISTS respostas (
    //         id int NOT NULL AUTO_INCREMENT,
    //         id_alternativa int NOT NULL, 
    //         dataHoraCriacao datetime NOT NULL,
    //         PRIMARY KEY(id)
    //         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

    //     this.conexao.query(sql, (erro) => {
    //         if (erro) {
    //             console.log(erro);
    //         } else {
    //             console.log("Tabela de respostas criada com sucesso")
    //         }
    //     });
    // }

    criaTbDisciplinas() {
        const sql = `CREATE TABLE IF NOT EXISTS disciplinas (
            id int NOT NULL AUTO_INCREMENT,
            nome varchar(20) NOT NULL DEFAULT '0',            
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de respostas criada com sucesso")
            }
        });
    }

    criaTbPolosXprovasxalunos() {
        const sql = `CREATE TABLE IF NOT EXISTS polosxprovasxalunos (
            id int NOT NULL AUTO_INCREMENT,
            id_polo int NOT NULL,
            id_prova int NOT NULL,
            id_aluno int NOT NULL,
            codigo_requerimento varchar(30) NOT NULL DEFAULT '0', 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de polosxprovasxalunos criada com sucesso");
            }
        });
    }

    criaTbDocumentos() {
        const sql = `CREATE TABLE IF NOT EXISTS documentos (
            id int NOT NULL AUTO_INCREMENT,
            autor text NOT NULL,
            titulo text NOT NULL, 
            tituloEmOutroIdioma text NOT NULL,
            data_defesa datetime NOT NULL,
            resumo text NOT NULL, 
            idioma varchar(255) NOT NULL,
            descricao text NOT NULL,  
            url text NOT NULL,            
            dataHoraCriacao datetime NOT NULL, 
            id_orientador int(11) NOT NULL, 
            id_tipoDocumento int(11) NOT NULL,
            id_linhaPesquisa int(11) NOT NULL, 
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de documentos criada com sucesso")
            }
        });
    }

    criaTbCoordenador() {
        const sql = `CREATE TABLE IF NOT EXISTS coordenador (
            id int NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL,       
            id_areaConcentracao int(11) NOT NULL,
            assinatura text NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id) 
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de coordenador criada com sucesso")
            }
        });
    }

    criaTbOrientador() {
        const sql = `CREATE TABLE IF NOT EXISTS orientador (
            id int NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL,
            id_areaConcentracao int(11) NOT NULL,
            assinatura text NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id) 
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de orientador criada com sucesso")
            }
        });
    }

    criaTbTipoDocumento() {
        const sql = `CREATE TABLE IF NOT EXISTS tipo_documento (
            id int NOT NULL AUTO_INCREMENT,
            nome text NOT NULL,             
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de tipo_documento criada com sucesso")
            }
        });
    }

    criaTbEventos() {
        const sql = `CREATE TABLE IF NOT EXISTS eventos (
            id int NOT NULL AUTO_INCREMENT,
            tema text NOT NULL,
            dataEventoInicial datetime NOT NULL, 
            dataEventoFinal datetime NOT NULL, 
            carga_horaria int NOT NULL,           
            dataHoraCriacao datetime NOT NULL,
            anexo int NOT NULL DEFAULT '0',
            grupo_trabalho int NOT NULL DEFAULT '0',
            status int NOT NULL DEFAULT '0',
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de eventos criada com sucesso")
            }
        });
    }

    criarTbMembros() {
        const sql = `CREATE TABLE IF NOT EXISTS membros (
            id int(11) NOT NULL AUTO_INCREMENT,
            faco_parte text,
            telefone varchar(15) DEFAULT '0', 
            vinculo_institucional int(11) NOT NULL DEFAULT '0',
            id_usuario int(11) NOT NULL,
            codigo_validacao varchar(255) DEFAULT '0',  
            tipo_membro int(11) NOT NULL, 
            comoSoube text NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)  
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de alunos criada com sucesso");
            }
        });
    }

    criarTbMembrosXEventos() {
        const sql = `CREATE TABLE IF NOT EXISTS membrosxeventos (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL,
            id_evento int(11) NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id) 
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de membrosxeventos criada com sucesso");
            }
        });
    }

    criarTbAnexos() {
        const sql = `CREATE TABLE IF NOT EXISTS anexos (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL,
            titulo text NOT NULL, 
            coautor text NOT NULL, 
            link text NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de anexos criada com sucesso");
            }
        });
    }

    criarTbAnexosXmembrosXgt() {
        const sql = `CREATE TABLE IF NOT EXISTS anexosxmembrosxgt (
            id int(11) NOT NULL AUTO_INCREMENT,
            titulo text NOT NULL, 
            coautor text NOT NULL, 
            link text NOT NULL,
            anexo_resposta text,
            observacao text, 
            id_usuario int(11) NOT NULL, 
            id_gt int(11) NOT NULL DEFAULT 0,
            id_status int(11) NOT NULL DEFAULT 8,
            idUsuarioMovto int(11), 
            dataHoraCriacao datetime NOT NULL,
            dataHoraAtualizacao datetime,
            PRIMARY KEY(id),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id), 
            FOREIGN KEY (id_gt) REFERENCES grupos_trabalho(id),
            FOREIGN KEY (id_status) REFERENCES status(id), 
            FOREIGN KEY (idUsuarioMovto) REFERENCES usuarios(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`; 

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de anexosxmembrosxgt criada com sucesso");
            }
        });
    }

    criarTbBancas() {
        const sql = `CREATE TABLE IF NOT EXISTS bancas (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_orientando int(11) NOT NULL,
            id_orientador int(11) NOT NULL,
            id_tipoBanca int(11) NOT NULL,
            id_linhaPesquisa int(11) NOT NULL, 
            id_membroInterno int(11) NOT NULL,
            id_membroExterno int(11) NOT NULL,
            data_horaPrevista datetime NOT NULL,
            titulo text NOT NULL,
            title text NOT NULL,
            resumo text NOT NULL,
            palavra_chave text NOT NULL,
            dataHoraCriacao datetime NOT NULL, 
            status TINYINT NOT NULL,  
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de bancas criada com sucesso");
            }
        });
    }

    criarTbDeclaracoes() {
        const sql = `CREATE TABLE IF NOT EXISTS declaracoes (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_membro int(11) NOT NULL,
            codigo_validacao int(11) NOT NULL,
            id_banca int(11) NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id), 
            FOREIGN KEY (id_banca) REFERENCES bancas(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de declarações criada com sucesso");
            }
        });
    }

    criarTbTipoMembroDaBanca() {
        const sql = `CREATE TABLE IF NOT EXISTS tipo_membro_banca (
            id int(11) NOT NULL AUTO_INCREMENT,
            nome varchar(20) NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id) 
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`; 

        this.conexao.query(sql, (erro) => {
            if (erro) { 
                console.log(erro);
            } else {
                console.log("Tabela de declarações criada com sucesso");
            }
        });
    }

    criarTbMembrosDaBanca() {
        const sql = `CREATE TABLE IF NOT EXISTS bancasxmembros (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL,
            id_banca int(11) NOT NULL,
            id_tipo int(11) NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id), 
            FOREIGN KEY (id_banca) REFERENCES bancas(id),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
            FOREIGN KEY (id_tipo) REFERENCES tipo_membro_banca(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de declarações criada com sucesso");
            }
        });
    }


    criaTbOrientandos() {
        const sql = `CREATE TABLE IF NOT EXISTS orientandos (
            id int NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL, 
            id_curso int(11) NOT NULL,
            id_orientador int(11) NOT NULL,
            id_coordenador int(11) NOT NULL, 
            id_linhaPesquisa int(11) NOT NULL,
            informacoes_adicionais text NOT NULL, 
            fase_processo int(11) NOT NULL, 
            dataHoraInicialFaseProcesso datetime NOT NULL,
            dataHoraFinalFaseProcesso datetime NOT NULL,
            dataHoraConclusao datetime NOT NULL,
            dt_confirmacaoTaxaQ datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            status_confirmacaoBancaQ int(11) NOT NULL DEFAULT 1, 
            dt_confirmacaoTaxaD datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, 
            status_confirmacaoBancaD int(11) NOT NULL DEFAULT 1, 
            observacao text NOT NULL, 
            arquivoTeseOuDissertacao text NOT NULL, 
            dataHoraCriacao datetime NOT NULL, 
            taxaQ double NOT NULL, 
            taxaD double NOT NULL,
            PRIMARY KEY(id) 
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de orientandos criada com sucesso");
            }
        });
    }

    criaTbCursos() {
        const sql = `CREATE TABLE IF NOT EXISTS cursos (
            id int NOT NULL AUTO_INCREMENT,
            nome text NOT NULL,   
            id_areaConcentracao int(11) NOT NULL,   
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de cursos criada com sucesso")
            }
        });
    }

    criaTbTipoDaBanca() {
        const sql = `CREATE TABLE IF NOT EXISTS tipo_banca (
            id int NOT NULL AUTO_INCREMENT,
            nome text NOT NULL,      
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de tipo_banca criada com sucesso")
            }
        });
    }

    criaTbStatus() {
        const sql = `CREATE TABLE IF NOT EXISTS status (
            id int NOT NULL AUTO_INCREMENT,
            nome text NOT NULL,      
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de status criada com sucesso")
            }
        });
    }

    criaTbATA() {
        const sql = `CREATE TABLE IF NOT EXISTS ata (
            id int NOT NULL AUTO_INCREMENT,
            link text NOT NULL,
            titulo_teseOuDissertacao text NOT NULL,
            quant_pag TINYINT NOT NULL DEFAULT 0,          
            dataHoraCriacao datetime NOT NULL,
            status varchar(255) NOT NULL DEFAULT '0', 
            id_banca int(11) NOT NULL,
            PRIMARY KEY(id) 
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de ATA criada com sucesso")
            }
        });
    }

    criaTbAreasConcentracao() {
        const sql = `CREATE TABLE IF NOT EXISTS areas_concentracao (
            id int NOT NULL AUTO_INCREMENT,
            nome text NOT NULL,            
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de areas_concentracao criada com sucesso")
            }
        });
    }

    criaTbLinhasPesquisas() {
        const sql = `CREATE TABLE IF NOT EXISTS linhas_pesquisas (
            id int NOT NULL AUTO_INCREMENT,
            nome text NOT NULL,            
            dataHoraCriacao datetime NOT NULL,
            id_areaConcentracao int(11) NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de linhas_pesquisas criada com sucesso")
            }
        });
    }

    criaTbFichaAvaliacao() {
        const sql = `CREATE TABLE IF NOT EXISTS ficha_avaliacao (
            id int NOT NULL AUTO_INCREMENT,
            titulo_projeto varchar(20) NOT NULL DEFAULT '0',            
            pergunta_condutora varchar(20) NOT NULL DEFAULT '0',  
            hipotese varchar(20) NOT NULL DEFAULT '0',  
            fundamentacao_teorica varchar(20) NOT NULL DEFAULT '0',  
            objetivo varchar(20) NOT NULL DEFAULT '0',  
            metodo varchar(20) NOT NULL DEFAULT '0',  
            cronograma varchar(20) NOT NULL DEFAULT '0',  
            conclusao_avaliacao text NOT NULL, 
            resumoQ1 text NOT NULL,   
            resumoQ2 text NOT NULL,      
            resumoQ3 text NOT NULL,      
            resumoQ4 text NOT NULL,      
            resumoQ5 text NOT NULL,      
            resumoQ6 text NOT NULL,      
            resumoQ7 text NOT NULL,      
            resumoQ8 text NOT NULL,      
            id_banca int(11) NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de ficha_avaliacao criada com sucesso")
            }
        });
    }

    criaTbMembroExterno() {
        const sql = `CREATE TABLE IF NOT EXISTS membro_externo (
            id int NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL, 
            link_lattes text NOT NULL, 
            vinculo_institucional int DEFAULT 0, 
            assinatura text NOT NULL, 
            dataHoraCriacao datetime NOT NULL, 
            PRIMARY KEY(id) 
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de membro_externo criada com sucesso");
            }
        });
    }

    criaTbOrientacao() {
        const sql = `CREATE TABLE IF NOT EXISTS orientacao (
            id int NOT NULL AUTO_INCREMENT,
            link text NOT NULL, 
            id_orientador int(11) NOT NULL, 
            id_orientando int(11) NOT NULL,  
            observacao text NOT NULL,
            dataHoraPrevista datetime NOT NULL, 
            dataHoraCriacao datetime NOT NULL, 
            PRIMARY KEY(id)  
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de orientação criada com sucesso");
            }
        });
    }

    criaTbOrientacaoXanexos() {
        const sql = `CREATE TABLE IF NOT EXISTS orientacaoxanexos (
            id int NOT NULL AUTO_INCREMENT,
            id_orientacao int NOT NULL, 
            id_anexo int NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de orientacaoxanexos criada com sucesso");
            }
        });
    }

    criaTbOrientacaoXanexosXorientando() {
        const sql = `CREATE TABLE IF NOT EXISTS orientacaoxanexosxorientandos (
            id int NOT NULL AUTO_INCREMENT,
            id_orientacao int NOT NULL, 
            id_anexo int NOT NULL, 
            id_orientando int NOT NULL, 
            dataHoraCriacao datetime NOT NULL, 
            PRIMARY KEY(id),
            FOREIGN KEY (id_orientacao) REFERENCES orientacao(id),
            FOREIGN KEY (id_anexo) REFERENCES anexos(id), 
            FOREIGN KEY (id_orientando) REFERENCES usuarios(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de orientacaoxanexos criada com sucesso");
            }
        });
    }

    criaTbGruposDeTrabalho() {
        const sql = `CREATE TABLE IF NOT EXISTS grupos_trabalho (
            id int NOT NULL AUTO_INCREMENT,
            nome text NOT NULL,            
            dataHoraCriacao datetime NOT NULL,
            id_evento int(11) NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de grupos_trabalho criada com sucesso")
            }
        });
    }

    criaTbMembrosxgruposDeTrabalho() {
        const sql = `CREATE TABLE IF NOT EXISTS membrosxgrupos_trabalho (
            id int NOT NULL AUTO_INCREMENT,
            id_membro int(11) NOT NULL,  
            id_grupo_trabalho int(11) NOT NULL,
            tipo int(11) NOT NULL,             
            dataHoraCriacao datetime NOT NULL,
            FOREIGN KEY (id_grupo_trabalho) REFERENCES grupos_trabalho(id),
            FOREIGN KEY (id_membro) REFERENCES usuarios(id),
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;` 

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de membrosxgrupos_trabalho criada com sucesso");
            }
        });
    }

    criaTbHabilidades() {
        const sql = `CREATE TABLE IF NOT EXISTS habilidades (
            id INT PRIMARY KEY AUTO_INCREMENT,
            nome VARCHAR(100) NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de habilidades criada com sucesso");
            }
        });
    }

    criaTbAreasDeAtuacao() {
        const sql = `
            CREATE TABLE IF NOT EXISTS areas_de_atuacao (
                id INT NOT NULL AUTO_INCREMENT,
                descricao VARCHAR(255) NOT NULL,
                habilidade_id INT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (habilidade_id) REFERENCES habilidades(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de areas_de_atuacao criada com sucesso");
            }
        });
    }

    criaTbPerguntas() {
        const sql = `CREATE TABLE IF NOT EXISTS perguntas (
            id INT PRIMARY KEY AUTO_INCREMENT,
            descricao VARCHAR(255) NOT NULL,
            habilidade_id INT NOT NULL,
            FOREIGN KEY (habilidade_id) REFERENCES habilidades(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de perguntas criada com sucesso");
            }
        });
    }

    criaTbTesteVocacional() {
        const sql = `CREATE TABLE IF NOT EXISTS teste_vocacional (
            id INT PRIMARY KEY AUTO_INCREMENT,
            id_usuario int NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de teste vocacional criado com sucesso");
            }
        });
    }

    criaTbRespostas() {
        const sql = `CREATE TABLE IF NOT EXISTS Respostas (
                id INT PRIMARY KEY AUTO_INCREMENT,
                id_testeVocacional INT NOT NULL,
                pergunta_id INT NOT NULL,
                resposta TINYINT NOT NULL,
                dataHoraCriacao datetime NOT NULL,
                FOREIGN KEY (id_testeVocacional) REFERENCES teste_vocacional(id),
                FOREIGN KEY (pergunta_id) REFERENCES perguntas(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de respostas criada com sucesso");
            }
        });
    }

    criaTbVinculoInstitucional() {
        const sql = `CREATE TABLE IF NOT EXISTS vinculo_institucional (
            id int NOT NULL AUTO_INCREMENT,
            nome text NOT NULL,            
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de vinculo_institucional criada com sucesso");
            }
        });
    }

    criaTbLiderGt() {
        const sql = `CREATE TABLE IF NOT EXISTS lider_gt (
                        id INT NOT NULL AUTO_INCREMENT,
                        id_usuario INT NOT NULL,
                        dataHoraCriacao datetime NOT NULL,
                        PRIMARY KEY (id), 
                        FOREIGN KEY (id_usuario) REFERENCES usuarios(id) 
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de lider_gt criada com sucesso");
            }
        });
    }

    criaTbLiderGtXGrupoTrabalho() {
        const sql = `
        CREATE TABLE IF NOT EXISTS lider_gtxgrupo_trabalho (
            id INT NOT NULL AUTO_INCREMENT,
            id_liderGt INT NOT NULL,
            id_grupoTrabalho INT NOT NULL,
            id_evento INT NOT NULL,
            dataHoraCriacao DATETIME NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (id_liderGt) REFERENCES lider_gt(id),
            FOREIGN KEY (id_grupoTrabalho) REFERENCES grupos_trabalho(id),
            FOREIGN KEY (id_evento) REFERENCES eventos(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;   
 
        this.conexao.query(sql, (erro) => { 
            if (erro) { 
                console.log(erro);
            } else {
                console.log("Tabela de lider_gtxgrupo_trabalho criada com sucesso");
            }
        });
    }

    criaTbInstituicoes() {
        const sql = `CREATE TABLE IF NOT EXISTS instituicoes (
                        id INT NOT NULL AUTO_INCREMENT,
                        cnpj VARCHAR(512) NOT NULL DEFAULT '0',
                        nome_fantasia VARCHAR(512) NOT NULL DEFAULT '0',
                        razao_social VARCHAR(512) NOT NULL DEFAULT '0',
                        dataHoraCriacao datetime NOT NULL,
                        PRIMARY KEY (id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de instituicoes criada com sucesso");
            }
        });
    }

    criaTbAberturaTurma() {
        const sql = `CREATE TABLE IF NOT EXISTS abertura_turma (
            id INT NOT NULL AUTO_INCREMENT,
            email TEXT NOT NULL,
            telefone VARCHAR(20) NOT NULL DEFAULT '0',
            observacao TEXT NOT NULL,
            id_instituicao INT NOT NULL,
            id_estado INT NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (id_instituicao) REFERENCES instituicoes(id),
            FOREIGN KEY (id_estado) REFERENCES estados(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de abertura_turma criada com sucesso");
            }
        });
    }

    criaTbPrioridades() {
        const sql = `CREATE TABLE IF NOT EXISTS prioridades (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(255) NOT NULL DEFAULT '0',
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de prioriodades criada com sucesso");
            }
        });
    }

    criaTbSetores() {
        const sql = `CREATE TABLE IF NOT EXISTS setores (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(255) NOT NULL DEFAULT '0',
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de setores criada com sucesso");
            }
        });
    }

    criaTbChamados() {
        const sql = `CREATE TABLE IF NOT EXISTS chamados (
            id INT NOT NULL AUTO_INCREMENT,
            descricao TEXT NOT NULL,
            dataHoraFinalizacao datetime NOT NULL,
            valor FLOAT,
            idSolicitante INT NOT NULL,
            idTipoChamado INT NOT NULL, 
            idResponsavel INT NOT NULL, 
            idSetorResponsavel INT NOT NULL,
            idPrioridade INT NOT NULL,
            visualizado tinyint,
            status INT NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY (id),  
            FOREIGN KEY (idSolicitante) REFERENCES usuarios(id), 
            FOREIGN KEY (idPrioridade) REFERENCES prioridades(id),
            FOREIGN KEY (idTipoChamado) REFERENCES tipos_chamados(id),
            FOREIGN KEY (idSetorResponsavel) REFERENCES setores(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de chamados criada com sucesso");
            }
        });
    }

    criaTbChamadosXsetores() {
        const sql = `CREATE TABLE IF NOT EXISTS chamadosxsetores (
            id INT NOT NULL AUTO_INCREMENT,
            id_chamado INT NOT NULL,
            id_setor INT NOT NULL, 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY (id),  
            FOREIGN KEY (id_chamado) REFERENCES chamados(id),
            FOREIGN KEY (id_setor) REFERENCES setores(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de chamadosxsetores criada com sucesso");
            }
        });
    }

    criaTbTiposChamados() {
        const sql = `CREATE TABLE IF NOT EXISTS tipos_chamados (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(500) NOT NULL DEFAULT '0', 
            dataHoraCriacao datetime NOT NULL,
            idSetor INT NOT NULL,
            FOREIGN KEY (idSetor) REFERENCES setores(id), 
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de tipos_chamados criada com sucesso");
            }
        });
    }

    criarTbAnexosXchamados() {
        const sql = `CREATE TABLE IF NOT EXISTS anexosxchamados (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_anexo int(11) NOT NULL,
            id_chamado int(11) NOT NULL DEFAULT '0',
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY(id),
            FOREIGN KEY (id_chamado) REFERENCES chamados(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de anexosxchamados criada com sucesso");
            }
        });
    }

    criarTbEstados() {
        const sql = `CREATE TABLE IF NOT EXISTS estados (
            id INT PRIMARY KEY AUTO_INCREMENT,
            sigla VARCHAR(2) NOT NULL,
            nome VARCHAR(50) NOT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de estados criada com sucesso");
            }
        });
    }

    criaTbTipoSolicitacoes() { 
        const sql = `CREATE TABLE IF NOT EXISTS tipo_solicitacao (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(500) NOT NULL DEFAULT '0', 
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de tipo_solicitacao criada com sucesso");
            }
        });
    }

    criaTbSolicitacoes() {
        const sql = `CREATE TABLE IF NOT EXISTS solicitacoes (
            id INT NOT NULL AUTO_INCREMENT,
            link text,     
            idSolicitante INT NOT NULL,
            idTipo INT NOT NULL,
            status INT NOT NULL,  
            dataHoraCriacao datetime NOT NULL,
            PRIMARY KEY (id),  
            FOREIGN KEY (idSolicitante) REFERENCES usuarios(id),
            FOREIGN KEY (idTipo) REFERENCES tipo_solicitacao(id),
            FOREIGN KEY (status) REFERENCES status(id) 
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;   
        this.conexao.query(sql, (erro) => { 
            if (erro) { 
                console.log(erro);
            } else {
                console.log("Tabela de solicitacoes criada com sucesso");
            }
        });
    }

    criaTbFolhaDeAprovacao() {
        const sql = `CREATE TABLE IF NOT EXISTS folha_aprovacao (
            id int NOT NULL AUTO_INCREMENT,
            titulo_teseOuDissertacao text,
            dataAprovacao datetime NOT NULL,
            dataHoraCriacao datetime NOT NULL,
            id_banca int(11) NOT NULL,
            PRIMARY KEY(id), 
            FOREIGN KEY (id_banca) REFERENCES bancas(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de folha_aprovacao criada com sucesso");
            }
        });
    }

    criaTbTemas() {
        const sql = `CREATE TABLE IF NOT EXISTS temas (
                id INT NOT NULL AUTO_INCREMENT,
                nome VARCHAR(255) NOT NULL,
                texto_base text NOT NULL,
                dataHoraCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id) 
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de temas criada com sucesso");
            }
        });
    }

    criaTbPlanos() {
        const sql = `CREATE TABLE IF NOT EXISTS planos (
                id INT NOT NULL AUTO_INCREMENT,
                nome VARCHAR(255) NOT NULL,
                dataHoraCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de planos criada com sucesso");
            }
        });
    }

    criaTbAlunosXplanos() {
        const sql = `
        CREATE TABLE IF NOT EXISTS alunosxplanos (
            id INT NOT NULL AUTO_INCREMENT,
            id_aluno INT NOT NULL,
            id_plano INT NOT NULL,
            dataHoraCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (id_aluno) REFERENCES alunos(id),
            FOREIGN KEY (id_plano) REFERENCES planos(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de alunosxplanos criada com sucesso");
            }
        });
    }

    criaTbTipoAluno() {
        const sql = `CREATE TABLE IF NOT EXISTS tipo_aluno (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(50) NOT NULL,
            dataHoraCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de tipo_aluno criada com sucesso");
            }
        });
    }

    criaTbAlunosXtemas() {
        const sql = `
        CREATE TABLE IF NOT EXISTS temasxalunos (
            id INT NOT NULL AUTO_INCREMENT,
            id_aluno INT NOT NULL,
            id_tema INT NOT NULL,
            dataHoraCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (id_aluno) REFERENCES alunos(id),
            FOREIGN KEY (id_tema) REFERENCES temas(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de temasxalunos criada com sucesso");
            }
        });
    }

    criaTbRedacoes() {
        const sql = `CREATE TABLE IF NOT EXISTS redacoes (
            id INT PRIMARY KEY AUTO_INCREMENT,
            link_envio text,
            link_recebimento text,
            nota DECIMAL(4,2),
            corrigido ENUM('Sim', 'Não'),
            id_tema INT NOT NULL,
            id_aluno INT NOT NULL,
            dataHoraCriacao DATETIME,
            FOREIGN KEY (id_aluno) REFERENCES alunos(id),
            FOREIGN KEY (id_tema) REFERENCES temas(id) 
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de redacoes criada com sucesso");
            }
        });
    }

    criaTbCertificados() {
        const sql = `CREATE TABLE IF NOT EXISTS certificados (
            id INT PRIMARY KEY AUTO_INCREMENT,
            curso text,
            id_usuario INT NOT NULL,
            dataHoraCriacao DATETIME,
            codigo_validacao VARCHAR(255) NOT NULL,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de certificados criada com sucesso");
            }
        });
    }

    criaTbChamadosXComentarios() {
        const sql = `CREATE TABLE IF NOT EXISTS chamadosxcomentarios (
            id INT NOT NULL AUTO_INCREMENT,
            descricao text NOT NULL,
            id_chamado INT NOT NULL,
            id_usuario INT NOT NULL,
            dataHoraCriacao DATETIME, 
            anexo text,
            PRIMARY KEY (id),
            FOREIGN KEY (id_chamado) REFERENCES chamados(id),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de chamadosxcomentarios criada com sucesso");
            }
        });
    }

    criaTbNotificacoes() {
        const sql = `CREATE TABLE IF NOT EXISTS notificacoes (
            id INT NOT NULL AUTO_INCREMENT, 
            descricao text,
            id_usuario INT NOT NULL,
            id_tipo_notificacao INT NOT NULL,
            dataHoraCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
            FOREIGN KEY (id_tipo_notificacao) REFERENCES tipo_notificacao(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de notificações criada com sucesso");
            }
        });
    }

    criaTbTipoNotificacao() {
        const sql = `CREATE TABLE IF NOT EXISTS tipo_notificacao (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(50) NOT NULL,
            dataHoraCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de tipo notificação criada com sucesso");
            }
        });
    }

    criaTbCredenciamento() {
        const sql = `CREATE TABLE IF NOT EXISTS credenciamento (
            id INT PRIMARY KEY AUTO_INCREMENT,
            id_usuario INT NOT NULL,
            id_instituicao INT NOT NULL,
            id_estado INT NOT NULL, 
            cidade VARCHAR(255) NOT NULL,
            observacao text NOT NULL,
            status INT NOT NULL,
            dataHoraCriacao DATETIME,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id), 
            FOREIGN KEY (id_instituicao) REFERENCES instituicoes(id),
            FOREIGN KEY (id_estado) REFERENCES estados(id),
            FOREIGN KEY (status) REFERENCES status(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`; 

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de credenciamento criada com sucesso");
            }
        });
    }

    criaTbChecklistCredenciamento() {
        const sql = `
        CREATE TABLE IF NOT EXISTS checklist_credenciamento (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(500) NOT NULL,
        dataHoraCriacao DATETIME NOT NULL 
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`; 

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de checklist_credenciamento criada com sucesso");
            }
        });
    }

    criaTbDocumentoCredenciamento() { 
        const sql = `CREATE TABLE IF NOT EXISTS documento_credenciamento (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_credenciamento INT NOT NULL,
        id_usuario INT NOT NULL,
        id_checklist_credenciamento INT NOT NULL,
        anexo TEXT NOT NULL,
        observacao TEXT NOT NULL, 
        status INT NOT NULL, 
        dataHoraCriacao DATETIME NOT NULL, 
        FOREIGN KEY (id_credenciamento) REFERENCES credenciamento(id),
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
        FOREIGN KEY (id_checklist_credenciamento) REFERENCES checklist_credenciamento(id),
        FOREIGN KEY (status) REFERENCES status(id) 
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;  
 
        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de documento_credenciamento criada com sucesso");
            }
        });
    }

    criaTbChecklistCredenciamentoXestado() {
        const sql = `
        CREATE TABLE IF NOT EXISTS checklist_credenciamentoxestado (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_estado INT NOT NULL,
        id_checklist INT NOT NULL,
        dataHoraCriacao DATETIME NOT NULL,
        FOREIGN KEY (id_estado) REFERENCES estados(id),
        FOREIGN KEY (id_checklist) REFERENCES checklist_credenciamento(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`; 

        this.conexao.query(sql, (erro) => {
            if (erro) { 
                console.log(erro);
            } else {
                console.log("Tabela de checklist_credenciamentoxestado criada com sucesso");
            }
        });
    }

    criaTbChecklistCredenciamentoXinstrucoes() {
        const sql = `CREATE TABLE IF NOT EXISTS checklist_credenciamentoxinstrucoes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        descricao text NOT NULL,
        id_checklist INT NOT NULL, 
        dataHoraCriacao DATETIME NOT NULL, 
        FOREIGN KEY (id_checklist) REFERENCES checklist_credenciamento(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`; 
 
        this.conexao.query(sql, (erro) => {
            if (erro) { 
                console.log(erro);
            } else {
                console.log("Tabela de checklist_credenciamentoxinstrucoes criada com sucesso");
            }
        });
    }

    criarTbDeclaracaoDeOrientacao() {
        const sql = `CREATE TABLE IF NOT EXISTS declaracao_orientacao (
            id int(11) NOT NULL AUTO_INCREMENT,
            codigo_validacao int(11) NOT NULL,
            id_usuario int(11) NOT NULL,
            id_banca int(11) NOT NULL,
            dataHoraCriacao datetime NOT NULL, 
            PRIMARY KEY(id),
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
            FOREIGN KEY (id_banca) REFERENCES bancas(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

        this.conexao.query(sql, (erro) => { 
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de declaracao_orientacao criada com sucesso");
            }
        });
    }

    criaTbBancasXmembroExterno() {
        const sql = `CREATE TABLE IF NOT EXISTS bancasxmembro_externo (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_banca INT NOT NULL,
        id_membroExterno INT NOT NULL, 
        dataHoraCriacao DATETIME NOT NULL, 
        FOREIGN KEY (id_banca) REFERENCES bancas(id), 
        FOREIGN KEY (id_membroExterno) REFERENCES membro_externo(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`; 
 
        this.conexao.query(sql, (erro) => { 
            if (erro) { 
                console.log(erro);
            } else {
                console.log("Tabela de bancasxmembro_externo criada com sucesso");
            }
        });
    }

    criaTbBancasXmembroInterno() {
        const sql = `CREATE TABLE IF NOT EXISTS bancasxmembro_interno (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_banca INT NOT NULL,
        id_membroInterno INT NOT NULL, 
        dataHoraCriacao DATETIME NOT NULL, 
        FOREIGN KEY (id_banca) REFERENCES bancas(id),
        FOREIGN KEY (id_membroInterno) REFERENCES orientador(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`; 
 
        this.conexao.query(sql, (erro) => {
            if (erro) { 
                console.log(erro); 
            } else {
                console.log("Tabela de bancasxmembro_interno criada com sucesso");
            }
        });
    } 

    criaTbTurmas() {  
        const sql = `CREATE TABLE IF NOT EXISTS turmas (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(50) NOT NULL,
            dataHoraCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

        this.conexao.query(sql, (erro) => {
            if (erro) {
                console.log(erro);
            } else {
                console.log("Tabela de turmas criada com sucesso");
            }
        });
    }
}

module.exports = new Tabelas