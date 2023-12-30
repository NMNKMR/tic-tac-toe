export const checkWinning = (index, turn, board)=> {
    let rowCount = 0, colCount = 0;
    //Row & Column Check
    let rowIndex = Math.floor(index/3)*3, colIndex = index % 3;
    const rowEnd = rowIndex+3, colEnd = colIndex+6;
    
    while(rowIndex<rowEnd && colIndex<=colEnd) {
        board[rowIndex] === turn && rowCount++;
        board[colIndex] === turn && colCount++;
        
        rowIndex++;
        colIndex+=3;
    }
    
    if(rowCount===3 || colCount===3) return true;
    
    //Diagonal Check
    if(index%2 === 0) {
        let diagonalCount = 0;
        if(index%4 === 0) for(let d=0; d<=8; d+=4) {
            board[d] === turn && diagonalCount++;
        }
        
        if(diagonalCount === 3) return true;
        else {
            diagonalCount = 0;
            if(index===4 || index%4!==0) for(let d=2; d<=6; d+=2) {
                board[d] === turn && diagonalCount++;
            }
            if(diagonalCount === 3) return true;
        }
    }
    
    return false;   
}

export const findBlockChoice = (index, player, board)=> {
    const compareTo = player;
    let rowCount = 0, colCount = 0, rowCpuIndex = -1, colCpuIndex = -1;
    //Row & Column Check
    let rowIndex = Math.floor(index/3)*3, colIndex = index % 3;
    const rowEnd = rowIndex+3, colEnd = colIndex+6;
    
    while(rowIndex<rowEnd && colIndex<=colEnd) {
        board[rowIndex] === compareTo ? rowCount++ : (board[rowIndex]===""? rowCpuIndex = rowIndex:null);
        board[colIndex] === compareTo ? colCount++ : (board[colIndex]===""? colCpuIndex = colIndex:null);
        
        rowIndex++;
        colIndex+=3;
    }
        
    if((rowCount===2 && rowCpuIndex!==-1) && (colCount===2 && colCpuIndex!==-1)) return Math.max(rowCpuIndex, colCpuIndex);
    else if(rowCount===2 && rowCpuIndex!==-1) return rowCpuIndex;
    else if(colCount===2 && colCpuIndex!==-1) return colCpuIndex;
    
    //Diagonal Check
    if(index%2 === 0) {
        let diagonalCount = 0;
        let diagIndex = -1;
        if(index%4 === 0) for(let d=0; d<=8; d+=4) {
            board[d] === compareTo ? diagonalCount++ : (board[d]===""? diagIndex = d:null);
        }
        
        if(diagonalCount === 2 && diagIndex!==-1) return diagIndex;
        else {
            diagonalCount = 0, diagIndex = -1;
            if(index===4 || index%4!==0) for(let d=2; d<=6; d+=2) {
                board[d] === compareTo ? diagonalCount++ : (board[d]===""? diagIndex = d:null);
            }
            if(diagonalCount === 2) return diagIndex;
        }
    }
    
    return -1;
    
}

export const findBestChoice = (markedIndexes)=> {
    const unMarkedIndexes = [];
    for(let i=0; i<9; i++) {
        !markedIndexes.includes(i) && unMarkedIndexes.push(i);
    }
    
    return unMarkedIndexes[Math.floor(Math.random() * unMarkedIndexes.length)];
}