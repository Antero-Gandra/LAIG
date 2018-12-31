/*INTELIGENCIA ARTIFICIAL RUDIMENTAR*/

/*RANDOM*/

jogaPC(Peca,Tabuleiro,TabOut):-
  sleep(1),
  obtemJogadasPossiveis(Tabuleiro,1,Jogadas),
  numeroJogadasPossiveis(Jogadas, Numero),
  NumeroJogadas is Numero + 1,
  random(1,NumeroJogadas,Jogada),
  selecionaJogada(Jogadas, Jogada, [NLinha|NCol]),
  NColuna is NCol,
  jogadaPC(NLinha,NColuna),
  setPeca(NLinha, NColuna, Peca,Tabuleiro, TabOut2),
  verificaJogada(TabOut2, NLinha, NColuna, Peca,  TabOut),!.

/*NOT RANDOM*/

jogaPCIA(Peca,Tabuleiro,TabOut):-
  sleep(1),
  obtemJogadasPossiveis(Tabuleiro,1,Jogadas),
  tentaViraPecas(Tabuleiro, Jogadas, Peca, NLinha,NColuna),
  jogadaPC(NLinha,NColuna),
  setPeca(NLinha, NColuna, Peca,Tabuleiro, TabOut2),
  verificaJogada(TabOut2, NLinha, NColuna, Peca,  TabOut),!.


tentaViraPecas(Tabuleiro, [], _,  NLinha, NColuna):- /*se nao houver peças para virar entao e random*/
  obtemJogadasPossiveis(Tabuleiro,1,Jogadas),
  numeroJogadasPossiveis(Jogadas, Numero),
  NumeroJogadas is Numero + 1,
  random(1,NumeroJogadas,Jogada),
  selecionaJogada(Jogadas, Jogada, [NLinha|NCol]),
  NColuna is NCol.

tentaViraPecas(Tabuleiro, [[NLinha,NColuna]|_], Peca,  NLinha, NColuna):-
  Nl is NLinha,
  Nc is NColuna,
  verificaJogadaIA(Tabuleiro, Nl, Nc, Peca), !.

tentaViraPecas(Tabuleiro, [_|RestoJogadas], Peca,  L, C):- tentaViraPecas(Tabuleiro, RestoJogadas,Peca,L,C).


verificaJogadaIA(Tabuleiro, NLinha, NColuna, Peca):-
  setPeca(NLinha, NColuna, Peca,Tabuleiro, TabAux),
  avancaParaLinha(TabAux, NLinha, L),
  verificaJogadaLinha(L, NColuna, Peca),
  verificaJogadaColuna(TabAux, NLinha, NColuna,Peca).

verificaJogadaIA(Tabuleiro, NLinha, NColuna, Peca):-
  setPeca(NLinha, NColuna, Peca,Tabuleiro, TabAux),
  verificaJogadaColuna(TabAux, NLinha, NColuna,Peca).

verificaJogadaIA(Tabuleiro, NLinha, NColuna, Peca):-
  setPeca(NLinha, NColuna, Peca,Tabuleiro, TabAux),
  avancaParaLinha(TabAux, NLinha, L),
  verificaJogadaLinha(L, NColuna, Peca).
