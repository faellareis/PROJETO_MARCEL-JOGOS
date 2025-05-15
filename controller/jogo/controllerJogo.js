/*************************************************** 
* Objetivo: Controller responsável pela regra de negócio do CRUD do jogo
* Data: 13/02/2025
* Autor: Rafa
* Versão: 1.0
****************************************************/

//Import do arquivo de configuração para mensagens e status code 
const MESSAGE = require('../../modulo/config.js')

//Import do DAO para realizar o CRUD no BD
const jogoDAO = require('../../model/DAO/jogo.js')

//Função para inserir um novo jogo
const inserirJogo = async function(jogo, contentType){
    try {

        if(String(contentType).toLowerCase() == 'application/json')
            {
                    if
        (jogo.nome           == undefined   || jogo.nome            == ''   ||  jogo.nome            == null     || jogo.nome.length            > 80  ||
        jogo.data_lancamento == undefined   || jogo.data_lancamento == ''   ||  jogo.data_lancamento == null     || jogo.data_lancamento.length > 10  ||
        jogo.versao          == undefined   || jogo.versao          == ''   ||  jogo.versao          == null     || jogo.versao.length          > 10  ||
        jogo.tamanho         == undefined   || jogo.tamanho.length  > 10    ||
        jogo.descricao       == undefined   ||
        jogo.foto_capa       == undefined   || jogo.foto_capa.length> 200   ||
        jogo.link            == undefined   || jogo.link.length     > 200   ||
        id_avaliacao         == undefined   || id_avaliacao         == ''   || id_avaliacao          == null     || isNaN(id)                         || id <= 0  
        ){
            return MESSAGE.ERROR_REQUIRED_FILES //400
        }else{
            //Encaminha os dados do novo jogo para ser inserido no BD
            let resultJogo = await jogoDAO.insertJogo(jogo)

            if(resultJogo)
                return MESSAGE.SUCESS_CREATED_ITEM //201
            else
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para atualizar um jogo
const atualizarJogo = async function(jogo, id, contentType){
    try{

        if(contentType == 'application/json'){
            if
            (
            jogo.nome           == undefined    || jogo.nome            == ''           || jogo.nome             == null     || jogo.nome.length            > 80  ||
            jogo.data_lancamento == undefined   || jogo.data_lancamento == ''           || jogo.data_lancamento  == null     || jogo.data_lancamento.length > 10  ||
            jogo.versao          == undefined   || jogo.versao          == ''           || jogo.versao           == null     || jogo.versao.length          > 10  ||
            jogo.tamanho         == undefined   || jogo.tamanho.length  > 10            ||
            jogo.descricao       == undefined   ||
            jogo.foto_capa       == undefined   || jogo.foto_capa.length> 200           ||
            jogo.link            == undefined   || jogo.link.length     > 200           ||
            id                   == undefined   || id                   == ''           || id                    == null     || isNaN(id)                         || id <= 0          ||
            jogo.id_avaliacao    == undefined   || jogo.id_avaliacao    == ''           || jogo.id_avaliacao     == null     || isNaN(id_avaliacao)               || jogo.id_avaliacao <= 0   
            ){
                return MESSAGE.ERROR_REQUIRED_FILES //400
            }else{
                //Validar se o id existe no BD
                let resultJogo = await jogoDAO.selectByIdJogo(parseInt(id))

                if(resultJogo.length > 0 ){
                    //Update
                    //Adiciona o ID do jogo no JSON com os dados
                    jogo.id = parseInt(id)

                    let result = await jogoDAO.updateJogo(jogo)

                    if(result){
                        return MESSAGE.SUCCESS_UPDATE_ITEM //200
                    }else{
                        return MESSAGE.ERROR_NOT_FOUND //404
                    }
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
} catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
}
}


//Função para excluir um jogo
const excluirJogo = async function(id) {
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0){
            return MESSAGE.ERROR_REQUIRED_FILES //400
      }else{
        //Funcção que verifica se  ID existe no BD
        let resultJogo = await jogoDAO.selectByIdJogo(parseInt(id))

        if(resultJogo != false || typeof(resultJogo) == 'object'){
            //Se existir, faremos o delete
            if(resultJogo.length > 0){
                //delete
                let result = await jogoDAO.deleteJogo(parseInt(id))

                if(result){
                    return MESSAGE.SUCCESS_DELETED_ITEM //200
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    }
} catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
}
}

//Função para retornar todos os jogos
const listarJogo = async function(){
    try {

        //Objeto do tipo array para utilizar no foreach para carregar os dados 
        //do filme e da classificacao
        const arrayJogos = []

        //Objeto do tipo JSON
        let dadosJogo = {}
        //Chama a função para retornar os filmes cadastrados
        let resultJogo = await jogoDAO.selectAllJogo()

        if(resultJogo != false || typeof(resultJogo) == 'object'){
            if(resultJogo.length > 0){

               
                //Criando um JSON de retorno de dados para a API
                dadosJogo.status = true
                dadosJogo.status_code = 200
                dadosJogo.items = resultJogo.length

                //resultFilme.forEach(async function(itemJogo){
                //foi necessário substituir o foreach pelo for of, pois
                //o foreach não consegue trabalhar com requisições async e await
                for(itemJogo of resultJogo){
                    //Busca os dados da classificação na controller de classificação
                    //Utilizando o ID da classificação (Chave estrangeira)
                    let dadosAvaliacao = await controllerAvaliacao.buscarAvaliacao(itemJogo.id_avaliacao)
                    
                    //Adicionando um atributo "classificacao" no JSON de filmes
                    itemJogo.avaliacao = dadosAvaliacao.avaliacao
                    //Remove o atributo id_classificacao do JSON de filmes, pois já temos
                    //o ID dentro dos dados da classificação
                    delete itemJogo.id_avaliacao
                    //Adiciona o JSON do filme, agora com os dados da classificação
                    //em um array
                    arrayJogos.push(itemJogo)
                }
                //Adiciona o novo array de filmes no JSON para retornar ao APP
                dadosJogo.films = arrayJogos

                return dadosJogo
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {

        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Função para buscar um jogo
const buscarJogo = async function(id) { //recebe ID
    try {

        let arrayJogos = []
        
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0){
            return MESSAGE.ERROR_REQUIRED_FILES //400
        }else{
            dadosJogo = {}

            let resultJogo = await jogoDAO.selectByIdJogo(parseInt(id))
            
            if(resultJogo != false || typeof(resultJogo) == 'object'){
                if(resultJogo.length > 0){
                     //Criando um JSON de retorno de dados para a API
                     dadosJogo.status = true
                     dadosJogo.status_code = 200

                    //o foreach não consegue trabalhar com requisições async e await
                    for(itemJogo of resultJogo){
                        //Busca os dados da classificação na controller de classificação
                        //Utilizando o ID da classificação (Chave estrangeira)
                        let dadosAvaliacao = await controllerAvaliacao.buscarAvaliacao(itemJogo.id_avaliacao)
                        
                        //Adicionando um atributo "classificacao" no JSON de filmes
                        itemJogo.avaliacao = dadosAvaliacao.avaliacao
                        //Remove o atributo id_classificacao do JSON de filmes, pois já temos
                        //o ID dentro dos dados da classificação
                        delete itemJogo.id_avaliacao
                        //Adiciona o JSON do filme, agora com os dados da classificação
                        //em um array
                        arrayJogos.push(itemJogo)
                    }

                    dadosJogo.films = arrayJogos

                    return dadosJogo //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = {
    inserirJogo,
    atualizarJogo,
    excluirJogo,
    listarJogo,
    buscarJogo
}