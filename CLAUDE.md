# esto es una carpeta para el taller y sus cosas

## Git Subtrees - Comandos de Memoria
```bash
# 🌳 Comandos esenciales de Git Subtrees
git subtree add --prefix=CARPETA REPO RAMA --squash     # Agregar subtree (primera vez)
git subtree pull --prefix=CARPETA REPO RAMA --squash    # Actualizar desde remoto
git subtree push --prefix=CARPETA REPO RAMA             # Enviar cambios al remoto

# 🤖 Script de automatización disponible
./subtree-automation.sh list                            # Ver subtrees configurados
./subtree-automation.sh add components                  # Agregar subtree
./subtree-automation.sh pull utils                      # Actualizar subtree
./subtree-automation.sh sync components                 # Pull + Push
./subtree-automation.sh sync-all                        # Sincronizar todos
```
