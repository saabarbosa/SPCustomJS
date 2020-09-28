# SPCustomJS
Projeto SharePoint de customizações utilizando JS

## Objetivo
Solução para customizações de Latoyt e WebParts no SharePoint utilizando Javascript. 

### CUSTOMIZAÇÕES

Obs: Recomenda-se instalar o SharePoint Designer (melhor acesso a listas, masterpages, etc).

Adicionar no diretório masterpage do SharePoint todas as customizações:
/_catalogs/masterpage/...


No caso específico (template_usjp)
/_catalogs/masterpage/template_usjp/assets/*
	/_catalogs/masterpage/template_usjp/assets/js (scripts do angular, jquery, bootstrap e principalmente as libs do SP)
	/_catalogs/masterpage/template_usjp/assets/css
	/_catalogs/masterpage/template_usjp/assets/img
	/_catalogs/masterpage/template_usjp/assets/fonts
	/_catalogs/masterpage/template_usjp/assets/custom (templates HTMLs para exibir em webpart de consulta de conteúdo)

----------------------------------------------------------------------------------------------------------------------------------------
Scripts para exportação e importação de sites, listas 
O cmdlet Export-SPWeb exporta um site, lista ou biblioteca. A capacidade de exportar de uma biblioteca é um novo recurso no SharePoint.

Export-SPWeb -Identity "http://servidor" -Path "c:\temp\SPWeb-Portal.cmp"

Subsite e listas
Export-SPWeb -Identity "http://servidor/teste" -Path "c:temp\SPWeb-Portal-teste.cmp"

Import-SPWeb "https://servidor/teste" -Path "c:\temp\SPWeb-Portal-Teste.cmp" -UpdateVersion
s Overwrite

