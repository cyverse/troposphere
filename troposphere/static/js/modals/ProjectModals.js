import AddImage from './project/addImage';
import CreateModal from './project/create';
import DestroyModal from './project/destroy';
import ExplainModal from './project/explainProjectDeleteConditions';
import CantMoveModal from './project/cantMoveAttached';
import MoveModal from './project/moveResources';
import RemoveModal from './project/removeResources';


export default {
    addImage: AddImage.addImage,
    create: CreateModal.create,
    destroy: DestroyModal.destroy,
    explainProjectDeleteConditions: ExplainModal.explainProjectDeleteConditions,
    cantMoveAttached: CantMoveModal.cantMoveAttached,
    moveResources: MoveModal.moveResources,
    removeResources: RemoveModal.removeResources
};
