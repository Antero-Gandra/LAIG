
mostraOpcoesMenuInicial:- write('       MENU INICIAL\n1. JOGADOR VS JOGADOR\n2. JOGADOR VS PC\n3. PC VS PC\n4. EXIT\n').

mostraOpcoesJogarContraPC:-write('ESCOLHA A DIFICULDADE\n1. EASY\n2. HARD\n3. BACK\n').

mostraMensagemDeErro(XMin, XMax):- write('ESCOLHA UM VALOR DE '), write(XMin), write( ' A '), write(XMax), write('\n').

mostraMensagemJogadaInvalida:- write('Tem de jogar em casas vazias!\n').

jogadaPC(NLinha,NColuna):-
  write('PC tentou jogar na linha '),
  write(NLinha),
  write(' e coluna '),
  write(NColuna),
  write('\n').

pedeColuna:- write(' Coluna ').
pedeLinha:- write(' Linha ').
pedeOpcao:- write(' Opcao: ').

sinalizaJogadorUm:- write('Jogador1: \n').
sinalizaJogadorDois:- write('Jogador2: \n').

jogador1Venceu:- write('JOGADOR 1 E O VENCEDOR!\n').
jogador2Venceu:- write('JOGADOR 2 E O VENCEDOR!\n').

imprimePontuacoes(JogadorUm, JogadorDois):-
  write('JOGADOR 1: '),
  write(JogadorUm),
  write('\nJOGADOR 2: '),
  write(JogadorDois),
  write('\n').

printBoard(Tab):- printTabuleiro(Tab).

printTabuleiro([H|T]):- write('\n'), write('         '), printLinha(H), write('\n'), printTabuleiro(T).
printTabuleiro([]):-write('\n').

printLinha([H|T]):- write(' '), write(H), write('  '),printLinha(T).
printLinha([]).
