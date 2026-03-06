import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportFinancialPDF = (transactions, stats, filters, userName) => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text('Relatório Financeiro', 14, 22)

    let currentY = 32

    if (userName) {
        doc.setFontSize(11)
        doc.setTextColor(60, 60, 60)
        doc.text(`Gerado para: ${userName}`, 14, currentY)
        currentY += 8
    }

    // Subtitle & Filters Info
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)

    const formatDate = (dateString) => {
        if (!dateString) return ''
        // Avoid timezone issues by using the string parts directly if needed
        // but for yyyy-mm-dd standard JS date parsing is fine if time is omitted
        const [year, month, day] = dateString.split('-')
        return `${day}/${month}/${year}`
    }

    let filterText = 'Filtros aplicados: '
    let filtersList = []

    if (filters.startDate && filters.endDate) {
        filtersList.push(`Período: ${formatDate(filters.startDate)} a ${formatDate(filters.endDate)}`)
    } else if (filters.startDate) {
        filtersList.push(`A partir de: ${formatDate(filters.startDate)}`)
    } else if (filters.endDate) {
        filtersList.push(`Até: ${formatDate(filters.endDate)}`)
    } else {
        filtersList.push('Período: Todo o histórico')
    }

    if (filters.type !== 'all') {
        filtersList.push(`Tipo: ${filters.type === 'entrada' ? 'Apenas Entradas' : 'Apenas Saídas'}`)
    }

    if (filters.category !== 'all') {
        filtersList.push(`Categoria: ${filters.category}`)
    }

    if (filters.search) {
        filtersList.push(`Busca: "${filters.search}"`)
    }

    filterText += filtersList.join(' | ')

    doc.text(filterText, 14, currentY)

    currentY += 10
    let yPos = currentY

    // Totals Box
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)

    const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    // Draw a subtle box for summary
    doc.setFillColor(248, 250, 252)
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(14, yPos - 6, 182, 14, 2, 2, 'FD')

    doc.text(`Entradas: ${formatCurrency(stats.income)}`, 20, yPos + 3)
    doc.text(`Saídas: ${formatCurrency(stats.expense)}`, 85, yPos + 3)

    doc.setFont(undefined, 'bold')
    doc.text(`Saldo: ${formatCurrency(stats.balance)}`, 140, yPos + 3)
    doc.setFont(undefined, 'normal')

    yPos += 20

    // Table Data
    const tableColumn = ["Data", "Categoria", "Descrição", "Tipo", "Valor"]
    const tableRows = []

    transactions.forEach(tx => {
        // Just extract date part and format as DD/MM/YYYY
        const dateStr = tx.created_at.split('T')[0]
        const [yyyy, mm, dd] = dateStr.split('-')

        const row = [
            `${dd}/${mm}/${yyyy}`,
            tx.categoria || '-',
            tx.summary || '-',
            tx.tipo === 'entrada' ? 'Entrada' : 'Saída',
            formatCurrency(tx.valor)
        ]
        tableRows.push(row)
    })

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: yPos,
        theme: 'striped',
        styles: {
            fontSize: 10,
            cellPadding: 4,
            font: 'helvetica'
        },
        headStyles: {
            fillColor: [59, 130, 246], // Primary blue
            textColor: 255,
            fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        didParseCell: function (data) {
            // Apply color to Type and Amount
            if (data.section === 'body') {
                const isEntrada = tableRows[data.row.index][3] === 'Entrada'

                if (data.column.index === 3 || data.column.index === 4) {
                    if (isEntrada) {
                        data.cell.styles.textColor = [21, 128, 61] // subtle green
                        data.cell.styles.fontStyle = 'bold'
                    } else {
                        data.cell.styles.textColor = [185, 28, 28] // subtle red
                        data.cell.styles.fontStyle = 'bold'
                    }
                }
            }
        }
    })

    const currentDate = new Date().toISOString().split('T')[0]

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(
            `Página ${i} de ${pageCount} - Gerado em ${new Date().toLocaleDateString('pt-BR')}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        )
    }

    doc.save(`relatorio_financeiro_${currentDate}.pdf`)
}
