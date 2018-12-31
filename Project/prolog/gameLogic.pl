:- use_module(library(lists)).

/*PECAS*/
pecaJogadorUm(X):- X = 'x'.
pecaJogadorDois(X):- X = 'o'.

/*MANIPULAR O TABULEIRO*/
getPeca(NLinha, NColuna, Tabuleiro, Peca):- getPecaLinha(NLinha,Tabuleiro,Linha), getPecaColuna(NColuna, Linha, Peca).

getPecaLinha(NLinha, [_|T], Linha):- Previous is NLinha-1, getPecaLinha(Previous, T, Linha).
getPecaLinha(1, [H|_], H).

getPecaColuna(NColuna, [_|T], Peca):- Previous is NColuna-1, getPecaColuna(Previous, T, Peca).
getPecaColuna(1, [H|_], H).

setPeca(NLinha, NColuna, Peca,TabIn, TabOut):- setPecaLinha(NLinha, NColuna,TabIn, Peca, TabOut).

setPecaLinha(NLinha, NColuna, [H|T], Peca, [H|R]):- Previous is NLinha-1, setPecaLinha(Previous, NColuna, T, Peca, R).

setPecaLinha(1, NColuna, [H|T], Peca, [I|T]) :- setPecaColuna(NColuna,H,Peca,I).

setPecaColuna(NColuna,[P|Resto],Peca,[P|Mais]) :- Previous is NColuna-1, setPecaColuna(Previous, Resto,Peca,Mais).

setPecaColuna(1,[_| Resto],Peca,[Peca|Resto]).

/*JOGADA*/
selecionaJogada([Jogada|_], 1, Jogada).
selecionaJogada([_|RestoJogadas], NumeroJogada, Jog):-
  Ng is NumeroJogada - 1,
  selecionaJogada(RestoJogadas, Ng, Jog).

numeroJogadasPossiveis([],0).
numeroJogadasPossiveis([_|RestoJogadas], C):- numeroJogadasPossiveis(RestoJogadas, X), C is X + 1.

obtemJogadasPossiveis([], _, []).
obtemJogadasPossiveis([Linha|Resto], NLinha,Jogadas):-
  adicionaJogadas(Linha, NLinha, 1,JogadasAux),
  Nl is NLinha + 1 ,
  obtemJogadasPossiveis(Resto,Nl,JogadasAux2),
  append(JogadasAux,JogadasAux2,Jogadas).

adicionaJogadas([], _,_,[]).

adicionaJogadas(['v'|Resto], NLinha, NColuna, [[NLinha,NColuna]|RestoJogadas]):-
  Nc is NColuna + 1,
  adicionaJogadas(Resto,NLinha, Nc, RestoJogadas).

adicionaJogadas([_|Resto], NLinha, NColuna, Jogadas):-
  Nc is NColuna + 1,
  adicionaJogadas(Resto,NLinha, Nc, Jogadas).

verificaJogada(Tabuleiro, NLinha, NColuna, Peca,  TabOut):-
  avancaParaLinha(Tabuleiro, NLinha, L),
  verificaJogadaLinha(L, NColuna, Peca),
  viraPecasLinha(Tabuleiro, NLinha, Peca, TabAux),
  verificaJogadaColuna(TabAux, NLinha, NColuna,Peca),
  viraPecasColuna(TabAux,Peca, NColuna, TabOut).

verificaJogada(Tabuleiro, NLinha, NColuna, Peca,  TabOut):-
  verificaJogadaColuna(Tabuleiro, NLinha, NColuna,Peca),
  viraPecasColuna(Tabuleiro,Peca, NColuna, TabOut).

verificaJogada(Tabuleiro, NLinha, NColuna, Peca,  TabOut):-
  avancaParaLinha(Tabuleiro, NLinha, L),
  verificaJogadaLinha(L, NColuna, Peca),
  viraPecasLinha(Tabuleiro, NLinha, Peca, TabOut).

verificaJogada(Tabuleiro, _, _, _, Tabuleiro).


verificaJogadaLinha(Linha,NColuna,Peca):-verificaViraPecasLinha(Linha, NColuna,Peca).
verificaJogadaColuna(Tabuleiro, NLinha, NColuna, Peca) :- verificaViraPecasColuna(Tabuleiro, NLinha, NColuna, Peca).

/*LINHA*/

avancaParaLinha([P|_],1,P).

avancaParaLinha([_|Resto],Contador,LinhaAvancada):-
  Nc is Contador-1,
  avancaParaLinha(Resto,Nc,LinhaAvancada).

viraLinha([],_,[]).
viraLinha(['v'|R],Peca,['v'|T]):-viraLinha(R,Peca,T), !.
viraLinha([_|R],Peca,[Peca|T]):-viraLinha(R,Peca,T), !.


viraPecasLinha([Linha|Resto],1,Peca,[NovaLinha|Resto]):- viraLinha(Linha,Peca,NovaLinha).
viraPecasLinha([Linha|Resto],NLinha, Peca,[Linha|NovoResto]):-
  Nl is NLinha - 1,
  viraPecasLinha(Resto, Nl, Peca, NovoResto).



verificaViraPecasLinha(Linha, NColuna,Peca):-
  contaPecasLinha(Linha, Peca, C),
  C == 2,
  verificaEspacosLinha(Linha,NColuna,Peca).


contaPecasLinha([],_,0).

contaPecasLinha([P|R], Peca, N):-
  P\=Peca,
  contaPecasLinha(R, Peca, N).

contaPecasLinha([Peca|Resto], Peca,N):-
  contaPecasLinha(Resto, Peca, Na),
  N is Na+1.

verificaEspacosLinha(Linha,NColuna,Peca):-
  verificaAtras(Linha,NColuna,Peca);
  avancaLinha(Linha,NColuna,NovaLinha),
  verificaFrente(NovaLinha,NColuna,Peca).

avancaLinha([P|Resto],0,[P|Resto]).

avancaLinha([_|Resto],NColuna,LinhaAvancada):-
  Nc is NColuna-1,
  avancaLinha(Resto,Nc,LinhaAvancada).

verificaAtras([Peca|_],2,Peca).

verificaAtras([Peca|Resto], NColuna, Peca):-
  Nc is NColuna-1,
  verificaAtrasPeca(Resto, Nc).

verificaAtras([_|Resto], NColuna, Peca):-
  Nc is NColuna-1,
  verificaAtras(Resto, Nc,Peca).

verificaAtrasPeca([_|_], 1).

verificaAtrasPeca([P|Resto], NColuna):-
  P \= 'v',
  Nc is NColuna-1,
  verificaAtrasPeca(Resto,Nc).

verificaFrente([Peca|_],_,Peca).

verificaFrente([P|Resto],NColuna,Peca):-
  P\='v',
  Nc is NColuna+1,
  Nc =< 8,
  verificaFrente(Resto,Nc,Peca).


/*COLUNAS*/
contaPecasColuna([],_,_,0).
contaPecasColuna([Linha|Mais], Coluna, Peca, N):-
  nth1(Coluna, Linha, Peca),
  contaPecasColuna(Mais, Coluna, Peca, Alguns),
  N is Alguns + 1.
contaPecasColuna([_|Mais], Coluna,Peca,N):-contaPecasColuna(Mais, Coluna, Peca, N).

verificaFrenteColuna([Linha|_],_, NColuna, Peca):-nth1(NColuna,Linha,Peca).
verificaFrenteColuna([Linha|Resto], NLinha, NColuna, Peca):-
   nth1(NColuna, Linha,X),
   X \= 'v',
   Nl is NLinha + 1,
   Nl =< 8,
   verificaFrenteColuna(Resto,Nl, NColuna, Peca).


verificaAtrasColuna([Linha|_],2,NColuna,Peca):- nth1(NColuna,Linha,Peca).
verificaAtrasColuna([Linha|Resto], NLinha, NColuna, Peca):-
  nth1(NColuna,Linha, Peca),
  Nl is NLinha -1,
  verificaAtrasColunaPeca(Resto,Nl, NColuna).
verificaAtrasColuna([_|Resto], NLinha, NColuna, Peca):-
  Nl is NLinha - 1,
  verificaAtrasColuna(Resto, Nl, NColuna, Peca).

verificaAtrasColunaPeca([_|_], 1, _).
verificaAtrasColunaPeca([Linha|Resto], NLinha, NColuna):-
   nth1(NColuna, Linha, X),
   X \= 'v',
   Nl is NLinha -1,
   verificaAtrasColunaPeca(Resto, Nl, NColuna).


verificaEspacosColuna(Tabuleiro, NLinha, NColuna, Peca):-
  verificaAtrasColuna(Tabuleiro, NLinha, NColuna, Peca);
  avancaLinha(Tabuleiro, NLinha, RestoTab),
  verificaFrenteColuna(RestoTab, NLinha, NColuna, Peca).

verificaViraPecasColuna(Tabuleiro, NLinha, NColuna, Peca):-
  contaPecasColuna(Tabuleiro, NColuna, Peca, C),
  !,
  C == 2,
  verificaEspacosColuna(Tabuleiro, NLinha, NColuna, Peca).

viraPecasColuna([], _,_,[]).
viraPecasColuna([Linha|T], Peca, NColuna, [L|R]):- alteraPecaColuna(Linha, NColuna, Peca, L), viraPecasColuna(T, Peca, NColuna,R).

alteraPecaColuna(['v'|T], 1,_,['v'|T]).
alteraPecaColuna([_|T], 1, Peca,[Peca|T]).
alteraPecaColuna([P|T], NColuna, Peca, [P|R]):-Nc is NColuna - 1, alteraPecaColuna(T, Nc, Peca, R).


/*FIM DO JOGO*/
komi(X):- X is 1.

verificaFim(Tabuleiro):-verificaFimDoJogo(Tabuleiro).

verificaFimDoJogo([]).
verificaFimDoJogo([Linha|T]):-verificaFimDoJogoLinha(Linha), verificaFimDoJogo(T).

verificaFimDoJogoLinha([]).
verificaFimDoJogoLinha([P|T]):- P\='v', verificaFimDoJogoLinha(T).

verificaVencedor(Tabuleiro, PecaJogador1, PecaJogador2, Vencedor):-
  contaPecas(Tabuleiro, PecaJogador1, X),
  contaPecas(Tabuleiro, PecaJogador2, Y),
  komi(K),
  Xnovo is X + K,
  vencedor(Xnovo, Y, Vencedor).

vencedor(Xnovo, Y,2):- Xnovo < Y.
vencedor(Xnovo, Y,1):- Xnovo > Y.
vencedor(Xnovo, Y, 0):- Xnovo = Y.

contaPecas([],_,0).
contaPecas([Linha|Resto], Peca, C):-
  contaPecasLinha(Linha, Peca, X),
  contaPecas(Resto,Peca,Y),
  C is X + Y.



/*VALIDACAO DE JOGADAS*/
validaJogada(Tabuleiro, NColuna, NLinha):- getPeca(NLinha, NColuna, Tabuleiro, 'v').


tabuleiroTeste(Tab):- Tab = [['v', 'o', 'o', 'o', 'o' ,'o' ,'o','v'] , ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'v' ,'v' ,'v','v'],['o', 'o', 'o', 'o', 'v' ,'v' ,'v','v']].
tabuleiroVazio(Tab):- Tab = [['v', 'v', 'v', 'v', 'v' ,'v' ,'v','v'] , ['v', 'v', 'v', 'v', 'v' ,'v' ,'v','v'], ['v', 'v', 'v', 'v', 'v' ,'v' ,'v','v'], ['v', 'v', 'v', 'v', 'v' ,'v' ,'v','v'], ['v', 'v', 'v', 'v', 'v' ,'v' ,'v','v'], ['v', 'v', 'v', 'v', 'v' ,'v' ,'v','v'], ['v', 'v', 'v', 'v', 'v' ,'v' ,'v','v'],['v', 'v', 'v', 'v', 'v' ,'v' ,'v','v']].
tabuleiroCheio(Tab):- Tab = [['x', 'o', 'o', 'o', 'o' ,'o' ,'o','v'] , ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'o' ,'o' ,'o','v'], ['o', 'o', 'o', 'o', 'x' ,'x' ,'x','v'],['o', 'o', 'o', 'o', 'x' ,'x' ,'x','v']].
