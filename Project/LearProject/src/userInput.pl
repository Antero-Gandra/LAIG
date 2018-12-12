leOpcao(XMin,XMax, X) :- pedeOpcao, read(X), X >= XMin, X =< XMax,!.
leOpcao(XMin, XMax, X):- mostraMensagemDeErro(XMin, XMax), leOpcao(XMin, XMax, X),!.


opcaoMenuInicial(1):- jogadorContraJogador.
opcaoMenuInicial(2):- menuJogarContraPC.
opcaoMenuInicial(3):- pcContraPC.
opcaoMenuInicial(4):- abort.

opcaoJogarContraPC(1):- jogadorContraPC.
opcaoJogarContraPC(2):- jogadorContraPCIA.
opcaoJogarContraPC(3).

/*opcaoMenuInicial(1):-
opcaoMenuInicial(1):-*/
