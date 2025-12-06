const Paginacion = ({ paginaActual, totalPaginas, siguiente }) => {

    const handleCambioPagina = (pagina) => {
        if (pagina < 1 || pagina > totalPaginas) {
            return;
        }
        siguiente(pagina)
    }

    return (
        <div className="paginacion">
            <button onClick={() => handleCambioPagina(paginaActual - 1)}>
                Anterior
            </button>
            <span> {paginaActual} de {totalPaginas} </span>
            <button onClick={()=> handleCambioPagina(paginaActual + 1)}>
                Siguiente
            </button>
        </div>
    )
}

export default Paginacion