:- use_module(library(random)).
:- use_module(library(system)).

menu:- mostraLogo, mostraOpcoesMenuInicial, leOpcao(1,4,X), opcaoMenuInicial(X), menu.

menuJogarContraPC:- mostraOpcoesJogarContraPC, leOpcao(1,3,X), opcaoJogarContraPC(X).


/*JOGADOR VS JOGADOR*/
jogadorContraJogador:-
  tabuleiroVazio(X),
  printBoard(X),
  pecaJogadorUm(A),
  pecaJogadorDois(B),
  jogaJogadorContraJogador(X,A,B).

jogaJogadorContraJogador(Tabuleiro, PecaJogadorUm, PecaJogadorDois):-
  sinalizaJogadorUm,
  jogaJogador(PecaJogadorUm, Tabuleiro, TabuleiroOut),
  printBoard(TabuleiroOut),
  \+verificaFim(TabuleiroOut),
  sinalizaJogadorDois,
  jogaJogador(PecaJogadorDois, TabuleiroOut, TabuleiroOut2),
  printBoard(TabuleiroOut2),
  \+verificaFim(TabuleiroOut2),
  jogaJogadorContraJogador(TabuleiroOut2,PecaJogadorUm,PecaJogadorDois).

jogaJogadorContraJogador(_,_,_).

jogaJogador(Peca, Tabuleiro, TabOut):-
  pedeLinha,
  leOpcao(1,8,NLinha),
  pedeColuna,
  leOpcao(1,8,NColuna),
  validaJogada(Tabuleiro, NColuna,NLinha),
  setPeca(NLinha, NColuna, Peca,Tabuleiro, TabOut2),
  verificaJogada(TabOut2, NLinha, NColuna, Peca,  TabOut),!.

jogaJogador(Peca,Tabuleiro,TabOut):- mostraMensagemJogadaInvalida, jogaJogador(Peca,Tabuleiro,TabOut).


/*PC VS PC*/

pcContraPC:-
  tabuleiroVazio(X),
  printBoard(X),
  pecaJogadorUm(A),
  pecaJogadorDois(B),
  jogaPCContraPC(X,A,B).

jogaPCContraPC(Tabuleiro, PecaJogadorUm, PecaJogadorDois):-
  sinalizaJogadorUm,
  jogaPC(PecaJogadorUm, Tabuleiro, TabuleiroOut),
  printBoard(TabuleiroOut),
  \+verificaFim(TabuleiroOut),
  sinalizaJogadorDois,
  jogaPC(PecaJogadorDois, TabuleiroOut, TabuleiroOut2),
  printBoard(TabuleiroOut2),
  \+verificaFim(TabuleiroOut2),
  jogaPCContraPC(TabuleiroOut2,PecaJogadorUm,PecaJogadorDois).

jogaPCContraPC(_,_,_).

/*JOGA CONTRA PC EASY*/
jogadorContraPC:-
  tabuleiroVazio(X),
  printBoard(X),
  pecaJogadorUm(A),
  pecaJogadorDois(B),
  jogaContraPC(X,A,B).

jogaContraPC(Tabuleiro, PecaJogadorUm, PecaJogadorDois):-
  sinalizaJogadorUm,
  jogaJogador(PecaJogadorUm, Tabuleiro, TabuleiroOut),
  printBoard(TabuleiroOut),
  \+verificaFim(TabuleiroOut),
  sinalizaJogadorDois,
  jogaPC(PecaJogadorDois, TabuleiroOut, TabuleiroOut2),
  printBoard(TabuleiroOut2),
  \+verificaFim(TabuleiroOut2),
  jogaContraPC(TabuleiroOut2,PecaJogadorUm,PecaJogadorDois).

jogaContraPC(_,_,_).


/*JOGA CONTRA PC HARD*/

jogadorContraPCIA:-
  tabuleiroVazio(X),
  printBoard(X),
  pecaJogadorUm(A),
  pecaJogadorDois(B),
  jogaContraPCIA(X,A,B).

jogaContraPCIA(Tabuleiro, PecaJogadorUm, PecaJogadorDois):-
  sinalizaJogadorUm,
  jogaJogador(PecaJogadorUm, Tabuleiro, TabuleiroOut),
  printBoard(TabuleiroOut),
  \+verificaFim(TabuleiroOut),
  sinalizaJogadorDois,
  jogaPCIA(PecaJogadorDois, TabuleiroOut, TabuleiroOut2),
  printBoard(TabuleiroOut2),
  \+verificaFim(TabuleiroOut2),
  jogaContraPCIA(TabuleiroOut2,PecaJogadorUm,PecaJogadorDois).

jogaContraPCIA(_,_,_).
